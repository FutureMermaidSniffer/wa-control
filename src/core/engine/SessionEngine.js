/**
 * SessionEngine — thin ops-facing facade over SessionManager (Baileys transport).
 *
 * Two-layer model (see plan):
 *   OPS (ports, warming, blasts, desks, MoreLogin) → SessionEngine → Baileys
 *
 * Controllers and workers should import from here, not construct SessionManager
 * directly. A single shared instance is set at boot via setSessionEngine().
 *
 * Engine link statuses (independent of Rocket ws_accounts labels):
 *   disconnected | connecting | qr_ready | pairing | linked | failed
 */

import SessionManager from '../sessions/SessionManager.js';
import db from '../../db/connection.js';

/** @type {SessionEngine | null} */
let shared = null;

export function setSessionEngine(inst) {
  shared = inst;
}

export function getSessionEngine() {
  if (!shared) {
    shared = new SessionEngine(db);
  }
  return shared;
}

/**
 * Map internal engine link mode + socket state to a simple status string.
 */
export function mapEngineStatus({ hasSocket, qrReady, pairing, linked, failed }) {
  if (failed) return 'failed';
  if (linked) return 'linked';
  if (pairing) return 'pairing';
  if (qrReady) return 'qr_ready';
  if (hasSocket) return 'connecting';
  return 'disconnected';
}

export class SessionEngine {
  /**
   * @param {import('knex').Knex} database
   * @param {SessionManager} [manager] optional pre-built manager (tests)
   */
  constructor(database, manager) {
    this.db = database;
    this.manager = manager || new SessionManager(database);
  }

  /** Underlying EventEmitter / SessionManager (for Socket.io wiring at boot). */
  get transport() {
    return this.manager;
  }

  // ----- Event bridge -----
  on(event, handler) {
    return this.manager.on(event, handler);
  }
  off(event, handler) {
    return this.manager.off(event, handler);
  }
  once(event, handler) {
    return this.manager.once(event, handler);
  }

  // ----- Linking (OpenWA-like) -----

  /**
   * Start a link challenge (QR or pairing). Non-blocking for QR.
   * @param {string} accountId
   * @param {{ mode: 'qr'|'pairing', phone?: string, forceNew?: boolean, forceDirect?: boolean }} opts
   */
  async startLink(accountId, opts = {}) {
    const mode = opts.mode === 'pairing' ? 'pairing' : 'qr';
    if (mode === 'pairing') {
      const phone = opts.phone || (await this.db('ws_accounts').where({ id: accountId }).first())?.phone;
      if (!phone) throw new Error('phone required for pairing mode');
      const code = await this.manager.requestPairingCode(accountId, phone, {
        forceNew: !!opts.forceNew,
        forceDirect: !!opts.forceDirect,
      });
      return {
        mode: 'pairing',
        accountId,
        phone,
        pairingCode: code,
        status: 'pairing',
      };
    }

    await this.manager.startQrLink(accountId, {
      forceNew: !!opts.forceNew,
      forceDirect: !!opts.forceDirect,
    });
    const account = await this.db('ws_accounts').where({ id: accountId }).first();
    return {
      mode: 'qr',
      accountId,
      phone: account?.phone,
      status: 'scan_qr',
    };
  }

  /**
   * Latest QR / pairing challenge for polling (OpenWA GET /qr style).
   */
  getLinkChallenge(accountId) {
    const qr = this.manager.getQRCode(accountId);
    const pairing = this.manager.getPairingCodes().find((c) => c.accountId === accountId);
    const active = this.manager.getActiveSessions().includes(accountId);

    if (qr?.qrDataUrl || qr?.qr) {
      return {
        mode: 'qr',
        status: 'qr_ready',
        qrCode: qr.qrDataUrl || null,
        qrRaw: qr.qr || null,
        at: qr.at,
        ageSeconds: qr.ageSeconds,
      };
    }
    if (pairing) {
      return {
        mode: 'pairing',
        status: 'pairing',
        pairingCode: pairing.code,
        ageSeconds: pairing.ageSeconds,
      };
    }
    return {
      mode: null,
      status: active ? 'connecting' : 'disconnected',
      qrCode: null,
      pairingCode: null,
    };
  }

  getQRCode(accountId) {
    return this.manager.getQRCode(accountId);
  }

  getPairingCodes() {
    return this.manager.getPairingCodes();
  }

  async stopLink(accountId) {
    return this.manager.disconnectAccount(accountId, false);
  }

  async disconnect(accountId, { permanent = false } = {}) {
    return this.manager.disconnectAccount(accountId, permanent);
  }

  /**
   * Engine-level status (not Rocket warehouse labels).
   */
  getStatus(accountId) {
    const active = this.manager.getActiveSessions().includes(accountId);
    const qr = this.manager.getQRCode(accountId);
    const pairing = this.manager.pairingInProgress?.has?.(accountId)
      || this.manager.getPairingCodes().some((c) => c.accountId === accountId);
    // Linked if socket open — best-effort without digging into sock internals
    const entry = active; // presence in active map
    return mapEngineStatus({
      hasSocket: entry,
      qrReady: !!(qr?.qrDataUrl || qr?.qr),
      pairing: !!pairing,
      linked: entry && !qr && !pairing,
      failed: false,
    });
  }

  getActiveSessions() {
    return this.manager.getActiveSessions();
  }

  // ----- Messaging / groups (ops workers use these) -----

  async sendText(accountId, to, text, options = {}) {
    return this.manager.sendText(accountId, to, text, options);
  }

  async getProfilePictureUrl(accountId, phoneOrJid, type = 'preview') {
    return this.manager.getProfilePictureUrl(accountId, phoneOrJid, type);
  }

  async updateProfile(accountId, opts) {
    return this.manager.updateProfile(accountId, opts);
  }

  async createGroup(accountId, subject, participants) {
    return this.manager.createGroup(accountId, subject, participants);
  }

  async getGroupInviteCode(accountId, groupJid) {
    return this.manager.getGroupInviteCode(accountId, groupJid);
  }

  async addParticipantsToGroup(accountId, groupJid, participants) {
    return this.manager.addParticipantsToGroup(accountId, groupJid, participants);
  }

  async getGroupMetadata(accountId, groupJid) {
    return this.manager.getGroupMetadata(accountId, groupJid);
  }

  async leaveGroup(accountId, groupJid) {
    return this.manager.leaveGroup(accountId, groupJid);
  }

  async connectAccount(accountId) {
    return this.manager.connectAccount(accountId);
  }

  /**
   * Safe reconnect from saved auth — no pairing code / QR / auth wipe.
   * @returns {Promise<{ accountId: string, phone: string, status: 'live'|'connecting', reconnected: boolean }>}
   */
  async reconnectAccount(accountId) {
    return this.manager.reconnectAccount(accountId);
  }

  isSocketLive(accountId) {
    return this.manager.isSocketLive?.(accountId) ?? this.manager.getActiveSessions().includes(accountId);
  }

  /** Low-level socket access for warming presence etc. Prefer sendText when possible. */
  async getOrCreateSocket(accountId) {
    return this.manager.getOrCreateSocket(accountId);
  }

  async requestPairingCode(accountId, phone, opts) {
    return this.manager.requestPairingCode(accountId, phone, opts);
  }

  async startQrLink(accountId, opts) {
    return this.manager.startQrLink(accountId, opts);
  }

  async disconnectAccount(accountId, permanent = false) {
    return this.manager.disconnectAccount(accountId, permanent);
  }

  async shutdownAll() {
    return this.manager.shutdownAll();
  }
}

export default SessionEngine;
