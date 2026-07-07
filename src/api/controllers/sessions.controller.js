import SessionManager from '../../core/sessions/SessionManager.js';
import db from '../../db/connection.js';
import { logger } from '../../utils/logger.js';
import portsData from '../../data/ports.data.js';

// Shared manager instance (initialized by src/index.js and reused)
let manager;

export function getSessionManager() {
  if (!manager) manager = new SessionManager(db);
  return manager;
}

// Allow index.js to inject the primary instance
export function setSessionManager(inst) {
  manager = inst;
}

export async function listSessions(req, res) {
  const active = getSessionManager().getActiveSessions();
  const accounts = await db('ws_accounts')
    .select('id', 'phone', 'status', 'display_name', 'port_id', 'proxy_id')
    .whereIn('id', active.length ? active : ['00000000-0000-0000-0000-000000000000']); // empty safe
  res.json({ active: active.length, sessions: accounts });
}

export async function listPairingCodes(req, res) {
  // Lightweight visibility endpoint for testing.
  // Shows current codes + the proxy (if any) assigned to the account.
  const codes = getSessionManager().getPairingCodes();
  const enriched = await Promise.all(codes.map(async (c) => {
    const acc = await db('ws_accounts').where({ id: c.accountId }).first();
    let proxy = null;
    if (acc?.proxy_id) {
      proxy = await db('proxies').where({ id: acc.proxy_id }).select('id', 'type', 'host', 'port').first();
    }
    return {
      ...c,
      proxy: proxy ? { id: proxy.id, type: proxy.type, host: proxy.host, port: proxy.port } : null,
    };
  }));
  res.json({ pending: codes.length, codes: enriched });
}

export async function connectNumber(req, res, next) {
  try {
    let { phone, accountId, portId, proxyId, acquisitionMethod = 'scan_linked', usePairingCode = false } = req.body;

    if (accountId && !phone) {
      const acc = await db('ws_accounts').where({ id: accountId }).first();
      if (acc) phone = acc.phone;
    }
    if (!phone) return res.status(400).json({ error: 'phone or accountId required' });

    // Create or find the account record
    let account = await db('ws_accounts').where({ phone }).first();
    const isPairingCodeFlow = usePairingCode || acquisitionMethod === 'phone_assoc';

    if (!account) {
      const insertData = {
        phone,
        acquisition_method: acquisitionMethod,
        // Explicit stages for primary vs linking (Rocket style)
        // primary_registered: primary WhatsApp registered (on phone or in cloud emulator), ready to link companion via Baileys
        // linking: handshake in progress
        // linked: successful (maps to active for now)
        status: isPairingCodeFlow ? 'primary_registered' : 'pending_login',
      };

      // Port is still deferred for pairing flows (allocated only on successful 'open').
      // But we now allow setting proxyId even for pairing code flows so the Baileys
      // connection during pairing can go through the desired proxy.
      insertData.port_id = (!isPairingCodeFlow && portId) ? portId : null;
      insertData.proxy_id = proxyId || null;

      const [created] = await db('ws_accounts')
        .insert(insertData)
        .returning('*');
      account = created;

      if (!isPairingCodeFlow && portId) {
        await portsData.incrementAssigned(portId, 1);
      }
    } else if (portId && account.port_id !== portId && !isPairingCodeFlow) {
      // reassign port only for non-cloud flows
      if (account.port_id) await portsData.decrementAssigned(account.port_id, 1);
      await db('ws_accounts').where({ id: account.id }).update({ port_id: portId });
      await portsData.incrementAssigned(portId, 1);
      account.port_id = portId;
    }

    // IMPORTANT (Rocket style): Proxy is selected/updated at the *linking* step,
    // not during primary registration. This is when the critical companion_hello
    // handshake happens.
    if (isPairingCodeFlow && proxyId !== undefined) {
      // Accept null (force direct), or a non-empty string (UUID). The DB FK will reject invalid UUIDs.
      if (proxyId !== null && typeof proxyId !== 'string') {
        return res.status(400).json({ error: 'proxyId must be a UUID string or null' });
      }
      if (account.proxy_id !== proxyId) {
        await db('ws_accounts').where({ id: account.id }).update({ proxy_id: proxyId || null });
        account.proxy_id = proxyId || null;
        logger.info(`[LINKING] Proxy ${proxyId || 'DIRECT'} assigned at linking time for ${account.phone}`);
      }
    }

    // Proxy assignment at linking time is logged via logger above.

    // For testing non-proxy (direct) linking, caller can pass proxyId: null explicitly.
    // Auto-proxy: only if a proxyId was explicitly passed in the request OR the account already has one.
    // Do NOT auto-pick from the proxies table — many proxies in the table may not support
    // WhatsApp WebSocket (HTTP proxies return 500, SOCKS5 proxies may block WA).
    // Direct connection works reliably. Proxy should only be applied intentionally.
    if (isPairingCodeFlow && !account.proxy_id && proxyId === undefined) {
      logger.info(`[PAIRING-CONNECT] No proxy assigned for ${phone} — using direct connection (recommended for initial link)`);
    }

    const mgr = getSessionManager();

    // Expose multiple linking paths (at least 2-3) to match observed Rocket flows.
    // - pairing_code (default, enter code on primary)
    // - scan_code (user scans or provides scan data)
    // - verification_code (import via code from primary)
    const linkingMethod = req.body.linkingMethod || (usePairingCode || acquisitionMethod === 'phone_assoc' ? 'pairing_code' : 'qr_scan');
    logger.info(`[LINKING] Path: ${linkingMethod} for ${phone}`);

    // For non-pairing paths (scan_code, verification_code), just prepare the account for linking
    // and return instructions. These can be extended to accept a code from primary.
    if (linkingMethod === 'scan_code' || linkingMethod === 'verification_code') {
      await db('ws_accounts').where({ id: account.id }).update({ status: 'linking' });
      return res.json({
        accountId: account.id,
        phone,
        status: 'ready_for_' + linkingMethod,
        linkingMethod,
        instructions: `Provide the ${linkingMethod} from the primary WhatsApp (in cloud). Call again or use dedicated endpoint to consume it.`,
      });
    }

    // Support phone-less / cloud / phone-primary flow using pairing code
    // (enter code directly in WhatsApp app running in your cloud emulator or on your phone as primary)
    if (linkingMethod === 'pairing_code' || usePairingCode || acquisitionMethod === 'phone_assoc') {
      try {
        const forceNew = !!req.body.forceNew;
        // If account status is not ready for pairing, revive it.
        // Covers: stuck linking, offline, error, pending_login (imported without pairing mode).
        const prevStatus = account.status;
        if (['offline', 'error', 'linking', 'pending_login'].includes(account.status)) {
          await db('ws_accounts').where({ id: account.id }).update({ status: 'primary_registered' });
          account.status = 'primary_registered';
          logger.info(`Revived ${phone} to primary_registered for re-pairing (was ${prevStatus})`);
        }
        // Temporary testing flag: forceDirect / noProxy / direct skips proxy for this linking attempt only.
        // Use for non-proxy troubleshooting of the companion handshake (as recommended).
        // Example: { "phone": "+13185167435", "usePairingCode": true, "forceDirect": true }
        const forceDirect = !!(req.body.forceDirect || req.body.noProxy || req.body.direct);

        const proxyInfo = account.proxy_id
          ? await db('proxies').where({ id: account.proxy_id }).select('id','type','host','port').first()
          : null;

        if (proxyInfo) {
          logger.info(`[PAIRING-CONNECT] Using proxy ${proxyInfo.id} (${proxyInfo.type}://${proxyInfo.host}:${proxyInfo.port}) for ${phone}`);
        } else {
          logger.info(`[PAIRING-CONNECT] No proxy (direct) for ${phone}`);
        }

        // Extra visible log so users always see the ID even in plain logs
        // Proxy details logged via structured logger. No loud banners.

        // Explicit 'linking' stage for the handshake
        await db('ws_accounts').where({ id: account.id }).update({ status: 'linking' });

        const code = await mgr.requestPairingCode(account.id, phone, { forceNew, forceDirect });

        return res.json({
          accountId: account.id,
          phone: account.phone,
          pairingCode: code,
          status: 'enter_pairing_code',
          proxy: proxyInfo ? { id: proxyInfo.id, type: proxyInfo.type, host: proxyInfo.host, port: proxyInfo.port } : null,
          note: 'Proxy shown above (auto-selected if none passed). Watch server logs for the exact "[PAIRING] Creating Baileys socket ..." line.',
          instructions: 'Server prints big banner. Look for "USING PROXY" or "DIRECT". GET /pairing-codes for live view with proxy.'
        });
      } catch (e) {
        // Surface proxy-specific errors clearly
        if (e.message && (e.message.includes('proxy') || e.message.includes('NotAllowed') || e.message.includes('Socks5'))) {
          return res.status(400).json({ error: e.message });
        }
        return res.status(400).json({ error: e.message || 'Failed to start pairing' });
      }
    }

    // Traditional QR scan flow (scan with physical or emulator phone)
    const qrHandler = ({ accountId, qr }) => {
      if (accountId === account.id) {
        res.json({ accountId: account.id, phone: account.phone, qr, status: 'scan_qr' });
        mgr.off('qr', qrHandler);
      }
    };
    mgr.on('qr', qrHandler);

    const connectedHandler = ({ accountId }) => {
      if (accountId === account.id) {
        mgr.off('qr', qrHandler);
        mgr.off('connected', connectedHandler);
      }
    };
    mgr.on('connected', connectedHandler);

    try {
      await mgr.connectAccount(account.id);
      setTimeout(() => {
        if (!res.headersSent) {
          res.json({ accountId: account.id, phone: account.phone, status: 'connecting_or_connected' });
        }
        mgr.off('qr', qrHandler);
        mgr.off('connected', connectedHandler);
      }, 800);
    } catch (e) {
      mgr.off('qr', qrHandler);
      mgr.off('connected', connectedHandler);
      throw e;
    }
  } catch (err) {
    next(err);
  }
}

export async function disconnectNumber(req, res, next) {
  try {
    const { accountId } = req.params;
    const mgr = getSessionManager();
    await mgr.disconnectAccount(accountId, req.body?.permanent === true);
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function sendTestMessage(req, res, next) {
  try {
    const { accountId } = req.params;
    const { to, text = 'Hello from WA Control (raw Baileys session)' } = req.body;
    const mgr = getSessionManager();
    const result = await mgr.sendText(accountId, to, text, { delayMs: 800 });
    res.json({ success: true, result });
  } catch (err) { next(err); }
}

/**
 * Mark an account as primary_registered so a pairing code can be requested.
 *
 * Use cases:
 *  1. Phone-primary: the real WhatsApp is already installed + registered on the user's phone.
 *     Call this to tell the system the primary is ready → then call /sessions/connect with
 *     usePairingCode:true and enter the code in the phone's WhatsApp.
 *  2. Reset a stuck 'linking' account without touching the DB manually.
 *
 * Also accepts { status: 'offline' | 'error' } if you want to force another status.
 */
export async function markRegistered(req, res, next) {
  try {
    const { accountId } = req.params;
    const targetStatus = req.body?.status || 'primary_registered';
    const allowedStatuses = ['primary_registered', 'offline', 'error'];
    if (!allowedStatuses.includes(targetStatus)) {
      return res.status(400).json({ error: `status must be one of: ${allowedStatuses.join(', ')}` });
    }

    const acc = await db('ws_accounts').where({ id: accountId }).first();
    if (!acc) return res.status(404).json({ error: 'Account not found' });

    // Tear down any active socket so the next connect is a clean slate
    const mgr = getSessionManager();
    await mgr.disconnectAccount(accountId, false).catch(() => {});

    await db('ws_accounts')
      .where({ id: accountId })
      .update({ status: targetStatus, baileys_auth_state: null, updated_at: db.fn.now() });

    logger.info(`Account ${acc.phone} manually marked as ${targetStatus}`, { accountId });
    res.json({
      success: true,
      accountId,
      phone: acc.phone,
      status: targetStatus,
      next: targetStatus === 'primary_registered'
        ? 'Call POST /api/v1/sessions/connect with { "phone": "' + acc.phone + '", "usePairingCode": true } to get your 8-digit pairing code'
        : `Account is now ${targetStatus}`,
    });
  } catch (err) { next(err); }
}
