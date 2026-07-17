/**
 * Sessions API — thin adapters over SessionEngine.
 * Ops (ports, status labels) live here / in SessionManager connected hooks;
 * link challenges (QR / pairing) go through the engine facade.
 */
import { getSessionEngine, setSessionEngine, SessionEngine } from '../../core/engine/SessionEngine.js';
import db from '../../db/connection.js';
import { logger } from '../../utils/logger.js';
import portsData from '../../data/ports.data.js';
import { normalizeWaPhone } from '../../utils/phone.js';

// Back-compat: getSessionManager returns the underlying transport or engine methods
export function getSessionManager() {
  return getSessionEngine();
}

export function setSessionManager(inst) {
  // Accept either SessionEngine or raw SessionManager
  if (inst?.manager) {
    setSessionEngine(inst);
  } else if (inst?.startQrLink || inst?.requestPairingCode) {
    // Raw SessionManager — wrap it
    const engine = new SessionEngine(db, inst);
    setSessionEngine(engine);
  } else {
    setSessionEngine(inst);
  }
}

export async function listSessions(req, res) {
  const engine = getSessionEngine();
  const active = engine.getActiveSessions();
  const accounts = await db('ws_accounts')
    .select('id', 'phone', 'status', 'display_name', 'port_id', 'proxy_id')
    .whereIn('id', active.length ? active : ['00000000-0000-0000-0000-000000000000']);
  res.json({ active: active.length, sessions: accounts });
}

export async function listPairingCodes(req, res) {
  const codes = getSessionEngine().getPairingCodes();
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

/**
 * OpenWA-style poll: GET latest QR (or pairing challenge) for an account.
 */
export async function getQr(req, res, next) {
  try {
    const { accountId } = req.params;
    const acc = await db('ws_accounts').where({ id: accountId }).first();
    if (!acc) return res.status(404).json({ error: 'Account not found' });

    if (acc.status === 'linked' || acc.status === 'active') {
      return res.status(400).json({
        error: 'Session is already linked; no QR needed',
        status: acc.status,
      });
    }

    const challenge = getSessionEngine().getLinkChallenge(accountId);
    if (!challenge.qrCode && !challenge.qrRaw && !challenge.pairingCode) {
      return res.status(400).json({
        error: 'QR code is not ready yet. Start link with POST /sessions/connect linkingMethod=qr_scan, then poll again.',
        status: challenge.status,
        accountStatus: acc.status,
      });
    }

    res.json({
      accountId,
      phone: acc.phone,
      qrCode: challenge.qrCode || null,
      qrRaw: challenge.qrRaw || null,
      pairingCode: challenge.pairingCode || null,
      mode: challenge.mode,
      status: challenge.status,
      ageSeconds: challenge.ageSeconds,
    });
  } catch (err) {
    next(err);
  }
}

export async function connectNumber(req, res, next) {
  try {
    let { phone, accountId, portId, proxyId, acquisitionMethod = 'scan_linked', usePairingCode = false } = req.body;

    if (accountId && !phone) {
      const acc = await db('ws_accounts').where({ id: accountId }).first();
      if (acc) phone = acc.phone;
    }
    if (!phone) return res.status(400).json({ error: 'phone or accountId required' });

    // Always digits-only for Baileys pairing (leading + is OK on input — we strip it)
    let phoneDigits;
    try {
      phoneDigits = normalizeWaPhone(phone);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    phone = phoneDigits;

    let account = await db('ws_accounts').where({ phone }).first()
      || await db('ws_accounts').where({ phone: `+${phone}` }).first()
      || (accountId ? await db('ws_accounts').where({ id: accountId }).first() : null);

    // Heal legacy rows stored with +
    if (account && account.phone !== phone) {
      await db('ws_accounts').where({ id: account.id }).update({ phone, updated_at: db.fn.now() });
      account.phone = phone;
    }

    const linkingMethod = req.body.linkingMethod
      || (usePairingCode || acquisitionMethod === 'phone_assoc' ? 'pairing_code' : 'qr_scan');
    const isPairingCodeFlow = linkingMethod === 'pairing_code' || usePairingCode || acquisitionMethod === 'phone_assoc';
    const isQrFlow = linkingMethod === 'qr_scan' || linkingMethod === 'qr';

    if (!account) {
      const insertData = {
        phone,
        acquisition_method: isQrFlow ? 'scan_linked' : acquisitionMethod,
        status: isPairingCodeFlow ? 'primary_registered' : 'pending_login',
        port_id: (!isPairingCodeFlow && !isQrFlow && portId) ? portId : null,
        proxy_id: proxyId || null,
      };

      const [created] = await db('ws_accounts')
        .insert(insertData)
        .returning('*');
      account = created;

      // Port deferred for QR + pairing (allocate on successful open only)
      if (!isPairingCodeFlow && !isQrFlow && portId) {
        await portsData.incrementAssigned(portId, 1);
      }
    } else if (portId && account.port_id !== portId && !isPairingCodeFlow && !isQrFlow) {
      if (account.port_id) await portsData.decrementAssigned(account.port_id, 1);
      await db('ws_accounts').where({ id: account.id }).update({ port_id: portId });
      await portsData.incrementAssigned(portId, 1);
      account.port_id = portId;
    }

    // Proxy at linking time (QR or pairing)
    if ((isPairingCodeFlow || isQrFlow) && proxyId !== undefined) {
      if (proxyId !== null && typeof proxyId !== 'string') {
        return res.status(400).json({ error: 'proxyId must be a UUID string or null' });
      }
      if (account.proxy_id !== proxyId) {
        await db('ws_accounts').where({ id: account.id }).update({ proxy_id: proxyId || null });
        account.proxy_id = proxyId || null;
        logger.info(`[LINKING] Proxy ${proxyId || 'DIRECT'} assigned at linking time for ${account.phone}`);
      }
    }

    if ((isPairingCodeFlow || isQrFlow) && !account.proxy_id && proxyId === undefined) {
      logger.info(`[LINK-CONNECT] No proxy for ${phone} — direct (recommended for initial link)`);
    }

    const engine = getSessionEngine();
    logger.info(`[LINKING] Path: ${linkingMethod} for ${phone}`);

    if (linkingMethod === 'scan_code' || linkingMethod === 'verification_code') {
      await db('ws_accounts').where({ id: account.id }).update({ status: 'linking' });
      return res.json({
        accountId: account.id,
        phone,
        status: 'ready_for_' + linkingMethod,
        linkingMethod,
        instructions: `Provide the ${linkingMethod} from the primary WhatsApp. Call again or use dedicated endpoint to consume it.`,
      });
    }

    // ----- Pairing code path -----
    if (isPairingCodeFlow) {
      try {
        const forceNew = !!req.body.forceNew;
        const prevStatus = account.status;
        if (['offline', 'error', 'linking', 'pending_login'].includes(account.status)) {
          await db('ws_accounts').where({ id: account.id }).update({ status: 'primary_registered' });
          account.status = 'primary_registered';
          logger.info(`Revived ${phone} to primary_registered for re-pairing (was ${prevStatus})`);
        }
        const forceDirect = !!(req.body.forceDirect || req.body.noProxy || req.body.direct);

        const proxyInfo = account.proxy_id
          ? await db('proxies').where({ id: account.proxy_id }).select('id', 'type', 'host', 'port').first()
          : null;

        await db('ws_accounts').where({ id: account.id }).update({ status: 'linking' });

        const result = await engine.startLink(account.id, {
          mode: 'pairing',
          phone,
          forceNew,
          forceDirect,
        });

        return res.json({
          accountId: account.id,
          phone: account.phone,
          pairingCode: result.pairingCode,
          status: 'enter_pairing_code',
          linkingMethod: 'pairing_code',
          proxy: proxyInfo ? { id: proxyInfo.id, type: proxyInfo.type, host: proxyInfo.host, port: proxyInfo.port } : null,
          instructions: 'Enter the code in WhatsApp → Linked Devices → Link with phone number. GET /sessions/:id/qr also returns the code while pending.',
        });
      } catch (e) {
        if (e.message && (e.message.includes('proxy') || e.message.includes('NotAllowed') || e.message.includes('Socks5'))) {
          return res.status(400).json({ error: e.message });
        }
        return res.status(400).json({ error: e.message || 'Failed to start pairing' });
      }
    }

    // ----- QR scan path (OpenWA-style: non-blocking; poll GET /qr or listen wa:qr) -----
    try {
      // Prefer safe reconnect when auth already exists (linked/offline/error with saved state)
      if (account.baileys_auth_state && !req.body.forceNew) {
        return res.status(409).json({
          error:
            'Saved auth exists — use POST /sessions/' + account.id + '/reconnect instead of QR. ' +
            'Pass forceNew:true only to wipe auth and create a new linked device (risks restrictions).',
          accountId: account.id,
          status: account.status,
          has_auth: true,
          next: 'POST /sessions/' + account.id + '/reconnect',
        });
      }
      // First-time (no auth): forceNew false is fine — manager clears empty state.
      // Explicit re-link: forceNew true wipes and shows new QR.
      const forceNew = !!req.body.forceNew;
      const forceDirect = !!(req.body.forceDirect || req.body.noProxy || req.body.direct);

      if (proxyId !== undefined && account.proxy_id !== proxyId) {
        await db('ws_accounts').where({ id: account.id }).update({ proxy_id: proxyId || null });
      }

      await engine.startLink(account.id, {
        mode: 'qr',
        forceNew,
        forceDirect,
      });

      // Non-blocking: return immediately; client polls GET …/qr or uses Socket.io wa:qr
      return res.status(202).json({
        accountId: account.id,
        phone: account.phone,
        status: 'scan_qr',
        linkingMethod: 'qr_scan',
        instructions:
          'Scan the QR with WhatsApp → Linked Devices → Link a device. ' +
          'Poll GET /api/v1/sessions/' + account.id + '/qr or listen for Socket.io event wa:qr. ' +
          'QR rotates every ~20s until linked.',
      });
    } catch (e) {
      return res.status(400).json({ error: e.message || 'Failed to start QR link' });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Safe reconnect: restore Baileys companion from baileys_auth_state without
 * requesting a pairing code or QR. Prefer this over /sessions/connect after
 * the first successful link (physical or cloud primary).
 */
export async function reconnectSession(req, res, next) {
  try {
    const { accountId } = req.params;
    const engine = getSessionEngine();

    const acc = await db('ws_accounts').where({ id: accountId }).first();
    if (!acc) return res.status(404).json({ error: 'Account not found' });

    if (!acc.baileys_auth_state) {
      return res.status(409).json({
        error: 'No saved auth state — link once via QR or pairing code first',
        accountId,
        phone: acc.phone,
        status: acc.status,
        has_auth: false,
        next: 'POST /sessions/connect with linkingMethod=qr_scan or usePairingCode:true',
      });
    }

    if (engine.isSocketLive?.(accountId)) {
      return res.json({
        success: true,
        accountId,
        phone: acc.phone,
        status: 'live',
        reconnected: false,
        has_auth: true,
        message: 'Session already live',
      });
    }

    try {
      const result = await engine.reconnectAccount(accountId);
      return res.json({
        success: true,
        accountId: result.accountId,
        phone: result.phone,
        status: result.status,
        reconnected: result.reconnected,
        has_auth: true,
        message: result.status === 'live'
          ? 'Session restored from saved auth'
          : 'Reconnect started — socket is connecting (listen for wa:connected)',
      });
    } catch (e) {
      if (e.code === 'NO_AUTH') {
        return res.status(409).json({
          error: e.message,
          accountId,
          phone: acc.phone,
          has_auth: false,
          next: 'POST /sessions/connect with linkingMethod=qr_scan or usePairingCode:true',
        });
      }
      logger.error('Reconnect failed', { accountId, phone: acc.phone, error: e.message });
      // Never clear auth on transient failure
      return res.status(502).json({
        error: e.message || 'Reconnect failed',
        accountId,
        phone: acc.phone,
        has_auth: true,
        hint: 'Auth was kept. Fix network and retry reconnect — do not re-link unless WhatsApp removed the device.',
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function disconnectNumber(req, res, next) {
  try {
    const { accountId } = req.params;
    const engine = getSessionEngine();
    await engine.disconnect(accountId, { permanent: req.body?.permanent === true });
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function sendTestMessage(req, res, next) {
  try {
    const { accountId } = req.params;
    const { to, text = 'Hello from WA Control (raw Baileys session)' } = req.body;
    const engine = getSessionEngine();
    const result = await engine.sendText(accountId, to, text, { delayMs: 800 });
    res.json({ success: true, result });
  } catch (err) { next(err); }
}

/**
 * Mark an account as primary_registered so a pairing code can be requested.
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

    const engine = getSessionEngine();
    await engine.disconnect(accountId, { permanent: false }).catch(() => {});

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
        ? 'POST /sessions/connect with usePairingCode:true, or linkingMethod:qr_scan for QR'
        : `Account is now ${targetStatus}`,
    });
  } catch (err) { next(err); }
}
