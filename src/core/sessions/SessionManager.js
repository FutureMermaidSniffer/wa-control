/**
 * SessionManager — Core raw control engine for WA Control.
 *
 * Responsibilities (matching PDF "raw control" + your requirements):
 * - Manage many simultaneous Baileys linked-device sessions (one per ws_account / port).
 * - Custom Postgres-backed auth state (creds + signal keys) — encrypted at rest.
 * - Per-session proxy injection (HTTP or SOCKS5) for geo distribution.
 * - QR code / pairing code login flows.
 * - Connection lifecycle, auto-reconnect with backoff.
 * - Expose high-level actions used by warming, blasts, group pulls, desk chat: send, profile update, group ops, presence.
 * - Emit events for realtime desk (via Socket.io) and internal jobs.
 *
 * This is the heart of the system. Everything else (ports, warming, CS desk, etc.) builds on live sessions from here.
 *
 * Production notes (from Baileys best practices + PDF-like scale):
 * - Never use filesystem-only auth state in production.
 * - Handle key state carefully (the custom loader does).
 * - Proxies are mandatory for multi-region / ban resistance.
 * - Each socket is relatively heavy — monitor memory / connection count.
 */

import makeWASocket, {
  useMultiFileAuthState, // only as fallback / reference
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers,
  initAuthCreds,
  BufferJSON,
  makeCacheableSignalKeyStore,
} from '@whiskeysockets/baileys';
import portsData from '../../data/ports.data.js';
import https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { EventEmitter } from 'events';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../../utils/logger.js';
import { encrypt, decrypt } from '../../utils/encryption.js';
import config from '../../config/index.js';
import pino from 'pino';

// Dedicated quiet logger for Baileys (prevents [object Object] spam and level noise)
const baileysLogger = pino({ level: process.env.BAILEYS_LOG_LEVEL || 'warn' });

// Broken IPv6 routes cause ETIMEDOUT to web.whatsapp.com; force IPv4 by default.
const socketFamily = process.env.WA_SOCKET_FAMILY
  ? parseInt(process.env.WA_SOCKET_FAMILY, 10)
  : 4;

// In-memory registry of active sockets by wsAccountId (string uuid)
const activeSockets = new Map(); // wsAccountId -> { sock, account, proxy }

/** Pairing codes expire quickly; reuse the same code within this window. */
const PAIRING_CODE_TTL_MS = 120_000;
/** Rapid reconnects on WA "Connection Failure" (405) invalidate the phone-side code. */
const PAIRING_FAILURE_RECONNECT_MS = 10_000;

export class SessionManager extends EventEmitter {
  constructor(db) {
    super();
    this.db = db;
    this.reconnectDelays = new Map(); // simple backoff per account
    /** @type {Map<string, { phone: string, code: string, startedAt: number, reconnectAttempts?: number }>} */
    this.pairingInProgress = new Map();
    /** @type {Map<string, { resolve: Function, reject: Function, timeout: NodeJS.Timeout }>} */
    this._pairingReadyWaiters = new Map();
  }

  /**
   * Get a live socket for an account. Creates/connects if necessary.
   * @param {string} accountId
   * @returns {Promise<any>} the Baileys socket
   */
  async getOrCreateSocket(accountId) {
    if (activeSockets.has(accountId)) {
      const entry = activeSockets.get(accountId);
      // sock.user (creds.me) is set during pairing before link completes — only reuse live sockets.
      if (entry.sock?.ws?.isOpen) return entry.sock;
      activeSockets.delete(accountId);
    }

    const account = await this.db('ws_accounts')
      .where({ id: accountId })
      .first();

    if (!account) throw new Error(`ws_account ${accountId} not found`);

    const proxy = account.proxy_id
      ? await this.db('proxies').where({ id: account.proxy_id }).first()
      : null;

    const sock = await this._createSocketForAccount(account, proxy);
    activeSockets.set(accountId, { sock, account, proxy });

    return sock;
  }

  async _createSocketForAccount(account, proxyRow) {
    const { state, saveCreds } = await this._getAuthState(account);

    const { version } = await fetchLatestBaileysVersion();

    const socketConfig = {
      version,
      auth: state,
      printQRInTerminal: false, // we surface QR via events / API
      browser: Browsers.ubuntu('Chrome'),
      logger: baileysLogger.child({ account: account.phone }),
      connectTimeoutMs: 60_000,
      defaultQueryTimeoutMs: 60_000,
      markOnlineOnConnect: false,
      // Proxy injection + IPv4 fallback for WA websocket (many VPS/Kali setups have broken IPv6)
      ...this._buildNetworkAgents(proxyRow),
    };

    const sock = makeWASocket(socketConfig);

    // Wire core events
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        // Surface QR for frontend (supervisor desk scan login)
        this.emit('qr', { accountId: account.id, phone: account.phone, qr });
        logger.info(`QR generated for ${account.phone}`);
      }

      this._resolvePairingReady(account.id, update);

      if (connection === 'open') {
        logger.info(`Session OPEN for ${account.phone} (${account.id})`);

        const wasPending = account.status === 'pending_verification' || account.status === 'pending_login';
        const isPhoneAssoc = account.acquisition_method === 'phone_assoc';

        const updatePatch = {
          status: 'active',
          last_linked_at: this.db.fn.now(),
          last_seen_at: this.db.fn.now(),
        };

        // Port allocation on success only (user request for transitional phone-first flows)
        // If this was a cloud / SMS-acquired number that was created without a port,
        // allocate one now (first available normal port with capacity).
        if ((wasPending || isPhoneAssoc) && !account.port_id) {
          try {
            // Find a port with remaining capacity
            const availablePort = await this.db('ports')
              .where({ status: 'active', type: 'normal' })
              .whereRaw('numbers_assigned < max_numbers')
              .orderBy('created_at')
              .first();

            if (availablePort) {
              updatePatch.port_id = availablePort.id;
              await portsData.incrementAssigned(availablePort.id, 1);
              logger.info('Allocated port on successful link (deferred from creation)', {
                accountId: account.id,
                phone: account.phone,
                portId: availablePort.id,
              });
            } else {
              logger.warn('No available port to allocate on link success for phone_assoc number', {
                accountId: account.id,
                phone: account.phone,
              });
            }
          } catch (e) {
            logger.error('Failed to auto-allocate port on link success', { error: e.message });
          }
        }

        await this.db('ws_accounts')
          .where({ id: account.id })
          .update(updatePatch);

        this.pairingInProgress.delete(account.id);
        this.emit('connected', { accountId: account.id, phone: account.phone });
        this.reconnectDelays.delete(account.id);
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        const reason = lastDisconnect?.error?.message || 'unknown';
        const awaitingPairing = this.pairingInProgress.has(account.id);

        if (awaitingPairing) {
          logger.info(
            `Pairing wait for ${account.phone}: ${reason} — enter the 8-digit code on the primary WhatsApp (Linked devices → Link a device). Retrying until linked or timeout.`
          );
        } else {
          logger.warn(`Session CLOSED for ${account.phone}: ${reason} (reconnect=${shouldReconnect})`);
        }

        if (!awaitingPairing) {
          await this.db('ws_accounts')
            .where({ id: account.id })
            .update({ status: shouldReconnect ? 'offline' : 'error' });
        }

        this.emit('disconnected', { accountId: account.id, phone: account.phone, reason, shouldReconnect });

        activeSockets.delete(account.id);

        if (shouldReconnect) {
          let delay = this._getBackoff(account.id);

          if (awaitingPairing) {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const pinfo = this.pairingInProgress.get(account.id);

            if (pinfo) {
              pinfo.reconnectAttempts = (pinfo.reconnectAttempts || 0) + 1;
              if (pinfo.reconnectAttempts > 12) {
                this.pairingInProgress.delete(account.id);
                logger.error(
                  `Pairing abandoned for ${account.phone} after ${pinfo.reconnectAttempts} reconnects. ` +
                  'The code is likely invalid — wait 15 min, then request a fresh code (or use QR login).'
                );
                return;
              }
            }

            // Baileys wiki: WA forcibly disconnects after companion_hello — restartRequired is normal.
            if (statusCode === DisconnectReason.restartRequired) {
              delay = 500;
            } else if (reason.includes('Connection Terminated')) {
              delay = 1500;
            } else if (reason.includes('Connection Failure')) {
              // Rapid 405 retries invalidate the code on the phone — back off aggressively.
              delay = PAIRING_FAILURE_RECONNECT_MS;
            } else {
              delay = 4000;
            }
          }

          setTimeout(() => {
            this.getOrCreateSocket(account.id).catch((e) =>
              logger.error(`Reconnect failed for ${account.phone}`, e)
            );
          }, delay);
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);

    // Basic message handler — forward to desk / jobs
    sock.ev.on('messages.upsert', (m) => {
      if (m.type === 'notify') {
        this.emit('messages.upsert', { accountId: account.id, messages: m.messages });
      }
    });

    // You can add more: groups.update, presence.update, etc. as needed by group pulls / desk / warming

    return sock;
  }

  _buildNetworkAgents(proxyRow) {
    if (proxyRow) return this._buildProxyConfig(proxyRow);

    const agent = new https.Agent({ family: socketFamily, keepAlive: true });
    return { agent, fetchAgent: agent };
  }

  _buildProxyConfig(proxyRow) {
    const { type, host, port, username, password_enc } = proxyRow;
    const password = password_enc ? decrypt(password_enc) : undefined;
    const auth = username ? `${username}:${password || ''}@` : '';
    const proxyUrl = `${type}://${auth}${host}:${port}`;

    try {
      if (type === 'socks5') {
        const agent = new SocksProxyAgent(proxyUrl);
        return { agent, fetchAgent: agent }; // Baileys accepts both in different versions
      } else {
        const agent = new HttpsProxyAgent(proxyUrl);
        return { agent, fetchAgent: agent };
      }
    } catch (e) {
      logger.error('Failed to create proxy agent', { proxyId: proxyRow.id, error: e.message });
      return this._buildNetworkAgents(null);
    }
  }

  /**
   * Custom DB-backed auth state (the production way).
   * Stores the full auth state (creds + keys) encrypted in ws_accounts.baileys_auth_state (JSONB).
   */
  async _getAuthState(account) {
    const loadState = async () => {
      let raw = account.baileys_auth_state;
      if (!raw) return undefined;

      if (typeof raw === 'string') {
        try { raw = JSON.parse(raw); } catch { /* ignore */ }
      }

      if (raw && raw.encrypted) {
        // Our encrypted format: { encrypted: true, data: "base64..." }
        const decrypted = decrypt(raw.data);
        return decrypted ? JSON.parse(decrypted, BufferJSON.reviver) : undefined;
      }
      return raw; // legacy plain (migrate on save)
    };

    const initial = (await loadState()) || {};

    // Baileys requires full crypto material (noiseKey, signedIdentityKey, etc.).
    // Empty {} creds cause requestPairingCode to crash on noiseKey.public.
    const state = {
      creds: initial.creds?.noiseKey ? initial.creds : initAuthCreds(),
      keys: initial.keys || {},
    };

    const saveCreds = async (creds) => {
      state.creds = { ...state.creds, ...creds };
      await this._persistAuthState(account.id, state);
    };

    const saveKeys = async (keys) => {
      // Baileys calls this internally via the keys store
      Object.assign(state.keys, keys);
      await this._persistAuthState(account.id, state);
    };

    const keyStore = {
      get: async (type, ids) => {
        const key = state.keys[type];
        if (!key) return undefined;
        return ids ? ids.map((id) => key[id]) : key;
      },
      set: async (data) => {
        for (const type in data) {
          state.keys[type] = { ...(state.keys[type] || {}), ...data[type] };
        }
        await saveKeys(state.keys);
      },
    };

    // Provide a full AuthenticationState shape that Baileys expects
    const fullState = {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(keyStore, baileysLogger.child({ account: account.phone })),
    };

    return { state: fullState, saveCreds };
  }

  async _persistAuthState(accountId, stateObj) {
    const json = JSON.stringify(stateObj, BufferJSON.replacer);
    const encrypted = encrypt(json);
    const payload = { encrypted: true, data: encrypted };

    await this.db('ws_accounts')
      .where({ id: accountId })
      .update({
        baileys_auth_state: payload,
        updated_at: this.db.fn.now(),
      });
  }

  _resolvePairingReady(accountId, update) {
    const waiter = this._pairingReadyWaiters.get(accountId);
    if (!waiter) return;

    if (update.qr || update.connection === 'connecting') {
      clearTimeout(waiter.timeout);
      this._pairingReadyWaiters.delete(accountId);
      waiter.resolve();
      return;
    }

    if (update.connection === 'close') {
      const code = update.lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        clearTimeout(waiter.timeout);
        this._pairingReadyWaiters.delete(accountId);
        waiter.reject(new Error('Logged out before pairing could start'));
      }
    }
  }

  /**
   * Baileys docs: wait for the QR/connecting phase before requestPairingCode.
   * Must be registered BEFORE the socket is created to avoid missing the event.
   */
  _armPairingReadyWait(accountId, timeoutMs = 60_000) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this._pairingReadyWaiters.delete(accountId);
        reject(new Error(
          'Timed out waiting for Baileys pairing phase. WhatsApp may be rate-limiting this number — wait 15 minutes or use QR login.'
        ));
      }, timeoutMs);

      this._pairingReadyWaiters.set(accountId, { resolve, reject, timeout });
    });
  }

  /** Clear partial pairing creds so a fresh code can be requested. */
  async _resetPairingAuth(accountId) {
    const entry = activeSockets.get(accountId);
    if (entry?.sock) {
      try { entry.sock.end(); } catch {}
    }
    activeSockets.delete(accountId);
    this.pairingInProgress.delete(accountId);
    const waiter = this._pairingReadyWaiters.get(accountId);
    if (waiter) {
      clearTimeout(waiter.timeout);
      this._pairingReadyWaiters.delete(accountId);
    }

    await this.db('ws_accounts')
      .where({ id: accountId })
      .update({ baileys_auth_state: null, status: 'pending_verification' });
  }

  _getBackoff(accountId) {
    const current = this.reconnectDelays.get(accountId) || 1000;
    const next = Math.min(current * 1.8, 30000);
    this.reconnectDelays.set(accountId, next);
    return current;
  }

  /**
   * Public high-level API used by the rest of the system
   */
  async connectAccount(accountId) {
    return this.getOrCreateSocket(accountId);
  }

  /**
   * Request a pairing code for phone number association login (cloud/emulator friendly).
   * Instead of showing a QR to scan, this returns an 8-digit code that you enter
   * directly in the WhatsApp app (running in your cloud emulator or on a phone).
   * This enables more automated / phone-less registration flows.
   *
   * Usage flow for cloud:
   * 1. Provision Android emulator in cloud (Android-x86, Waydroid, etc.)
   * 2. Install WhatsApp, register the number using virtual SMS.
   * 3. Call this to get a pairing code.
   * 4. Enter the code in the WhatsApp app inside the emulator.
   * 5. Linking completes → auth state saved in DB → you can shut down the emulator.
   */
  async requestPairingCode(accountId, phoneNumber, { forceNew = false } = {}) {
    const existing = this.pairingInProgress.get(accountId);
    if (!forceNew && existing && Date.now() - existing.startedAt < PAIRING_CODE_TTL_MS) {
      logger.info(`Reusing in-flight pairing code for ${phoneNumber}: ${existing.code}`);
      return existing.code;
    }

    const account = await this.db('ws_accounts').where({ id: accountId }).first();
    if (account?.baileys_auth_state) {
      const { state } = await this._getAuthState(account);
      if (state.creds?.registered) {
        throw new Error('Account is already linked. Disconnect first if you want to re-link.');
      }
      // Partial pairing creds (me/pairingCode without registered) break reconnect — start clean.
      if (forceNew || state.creds?.pairingCode || state.creds?.me) {
        await this._resetPairingAuth(accountId);
      }
    } else if (forceNew) {
      await this._resetPairingAuth(accountId);
    }

    // Official Baileys flow: arm waiter first, then create socket, wait for QR/connecting, then request code.
    const pairingReady = this._armPairingReadyWait(accountId);
    const sock = await this.getOrCreateSocket(accountId);
    await pairingReady;
    await sock.waitForSocketOpen();

    const code = await sock.requestPairingCode(phoneNumber.replace(/[^0-9]/g, ''));

    this.pairingInProgress.set(accountId, {
      phone: phoneNumber,
      code,
      startedAt: Date.now(),
      reconnectAttempts: 0,
    });

    this.emit('pairing_code', { accountId, phone: phoneNumber, code });

    logger.info(`Pairing code for ${phoneNumber}: ${code}`);
    logger.info(
      `Enter ${code} on the primary WhatsApp within ~60s: Linked devices → Link a device. ` +
      'Do NOT re-run the script (that invalidates the code). Leave this process running.'
    );

    return code;
  }

  async disconnectAccount(accountId, permanent = false) {
    const entry = activeSockets.get(accountId);
    if (entry?.sock) {
      try { await entry.sock.logout(); } catch {}
      entry.sock.end();
    }
    activeSockets.delete(accountId);

    if (permanent) {
      await this.db('ws_accounts').where({ id: accountId }).update({ status: 'offline', baileys_auth_state: null });
    }
  }

  async sendText(accountId, to, text, options = {}) {
    const sock = await this.getOrCreateSocket(accountId);
    // Add small randomized delay for "human" feel (important for warming + anti-ban)
    if (options.delayMs) await new Promise((r) => setTimeout(r, options.delayMs));
    return sock.sendMessage(to, { text });
  }

  async updateProfile(accountId, { name, avatarBufferOrPath }) {
    const sock = await this.getOrCreateSocket(accountId);
    if (name) await sock.updateProfileName(name);
    if (avatarBufferOrPath) {
      const buffer = Buffer.isBuffer(avatarBufferOrPath)
        ? avatarBufferOrPath
        : await fs.readFile(avatarBufferOrPath);
      await sock.updateProfilePicture(buffer);
    }
    // Update DB record
    await this.db('ws_accounts').where({ id: accountId }).update({
      display_name: name || undefined,
      // avatar_url would be set after successful update if you fetch it
      updated_at: this.db.fn.now(),
    });
  }

  /**
   * Create a new group using the given ws account as admin/creator.
   * Returns the created group JID and metadata.
   */
  async createGroup(accountId, subject, initialParticipants = []) {
    const sock = await this.getOrCreateSocket(accountId);
    // initialParticipants should be full JIDs or phones that will be normalized by Baileys
    const participants = initialParticipants.map(p => p.includes('@') ? p : `${p.replace(/[^\d]/g, '')}@s.whatsapp.net`);
    const res = await sock.groupCreate(subject, participants);
    // res: { id: 'xxx@g.us', subject, ... }
    logger.info('Group created', { accountId, subject, groupJid: res.id });
    return res;
  }

  /**
   * Get the invite code (and full link) for a group.
   */
  async getGroupInviteCode(accountId, groupJid) {
    const sock = await this.getOrCreateSocket(accountId);
    const code = await sock.groupInviteCode(groupJid);
    const link = `https://chat.whatsapp.com/${code}`;
    return { code, link, groupJid };
  }

  /**
   * Add participants to an existing group. The accountId must have admin rights on the group.
   * participants: array of phone strings or JIDs.
   */
  async addParticipantsToGroup(accountId, groupJid, participants = []) {
    const sock = await this.getOrCreateSocket(accountId);
    const jids = participants.map(p => p.includes('@') ? p : `${p.replace(/[^\d]/g, '')}@s.whatsapp.net`);
    // Baileys: groupParticipantsUpdate(jid, participants, action)
    const result = await sock.groupParticipantsUpdate(groupJid, jids, 'add');
    logger.info('Added participants to group', { accountId, groupJid, count: jids.length, result });
    return result;
  }

  /**
   * Fetch group metadata (useful for member list, subject, etc.)
   */
  async getGroupMetadata(accountId, groupJid) {
    const sock = await this.getOrCreateSocket(accountId);
    return sock.groupMetadata(groupJid);
  }

  /**
   * Leave a group (if needed for ops).
   */
  async leaveGroup(accountId, groupJid) {
    const sock = await this.getOrCreateSocket(accountId);
    return sock.groupLeave(groupJid);
  }

  getActiveSessions() {
    return Array.from(activeSockets.keys());
  }

  // Called on shutdown
  async shutdownAll() {
    for (const [id, entry] of activeSockets) {
      try { entry.sock?.end(); } catch {}
    }
    activeSockets.clear();
  }
}

export default SessionManager;
