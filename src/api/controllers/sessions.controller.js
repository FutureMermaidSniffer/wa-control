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
        status: isPairingCodeFlow ? 'pending_verification' : 'pending_login',
      };

      // For normal flows, allow explicit port assignment.
      // For phone_assoc / cloud / pairing code flows we deliberately defer port allocation
      // until successful connection (see SessionManager 'open' handler + user request).
      if (!isPairingCodeFlow) {
        insertData.port_id = portId || null;
        insertData.proxy_id = proxyId || null;
      }

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

    const mgr = getSessionManager();

    // Support phone-less / cloud emulator flow using pairing code
    // (enter code directly in WhatsApp app running in your cloud Android emulator)
    if (usePairingCode || acquisitionMethod === 'phone_assoc') {
      try {
        const code = await mgr.requestPairingCode(account.id, phone);
        return res.json({
          accountId: account.id,
          phone: account.phone,
          pairingCode: code,
          status: 'enter_pairing_code',
          instructions: 'Enter this 8-digit code in the WhatsApp app (running in your cloud emulator) to link the session without scanning a QR.'
        });
      } catch (e) {
        return res.status(400).json({ error: e.message });
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
