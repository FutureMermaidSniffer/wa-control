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
import { proto } from '@whiskeysockets/baileys/WAProto/index.js';

// One-time global patch: make the "WEB" platform send MACOS (24) instead.
// This is the #1 fix for 405 "Connection Failure" + "frc" during fresh
// requestPairingCode / companion_hello. Official web clients present better
// fingerprints; this makes Baileys look more like a trusted desktop companion.
// Applied once at load so every socket benefits (especially pairing flows).
try {
  const UA = proto?.ClientPayload?.UserAgent?.Platform;
  if (UA && UA.WEB !== UA.MACOS) {
    UA.WEB = UA.MACOS; // 24
    console.log('[WA-PATCH] Forced UserAgent.Platform.WEB → MACOS (24) to bypass 405 on pairing');
  }
} catch (e) {
  console.warn('[WA-PATCH] Could not apply platform patch:', e.message);
}
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

// Use macOS Desktop browser identifier. Strongly recommended for reliable
// pairing code flows (avoids 405/515/408 platform rejections that lead to
// "couldn't link device" even when code is entered fast). Ubuntu/Chrome often
// triggers server-side link failures during companion_hello.
const DEFAULT_BROWSER = process.env.WA_BROWSER
  ? (() => {
      const b = (process.env.WA_BROWSER || '').toLowerCase();
      if (b.includes('mac')) return Browsers.macOS('Desktop');
      if (b.includes('win')) return Browsers.windows('Chrome');
      if (b.includes('ubuntu')) return Browsers.ubuntu('Chrome');
      return Browsers.macOS('Desktop');
    })()
  : Browsers.macOS('Desktop');

// In-memory registry of active sockets by wsAccountId (string uuid)
const activeSockets = new Map(); // wsAccountId -> { sock, account, proxy }

/** Pairing codes expire quickly; reuse the same code within this window. */
const PAIRING_CODE_TTL_MS = 120_000;
/** Rapid reconnects on WA "Connection Failure" (405) invalidate the phone-side code. */
const PAIRING_FAILURE_RECONNECT_MS = 6_000;
/** For restartRequired (common after companion_hello and pair-success), reconnect fast to keep the link window alive. */
const PAIRING_RESTART_RECONNECT_MS = 250;

export class SessionManager extends EventEmitter {
  constructor(db) {
    super();
    this.db = db;
    this.reconnectDelays = new Map(); // simple backoff per account
    /** @type {Map<string, { phone: string, code: string, startedAt: number, reconnectAttempts?: number }>} */
    this.pairingInProgress = new Map();
    /** @type {Map<string, { resolve: Function, reject: Function, timeout: NodeJS.Timeout }>} */
    this._pairingReadyWaiters = new Map();
    /** @type {Map<string, NodeJS.Timeout>} reminder timers for visible code echo during testing */
    this._pairingReminders = new Map();
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

    // Detect if this socket is for a fresh pairing flow (no registered creds yet)
    const isLikelyPairing = !state?.creds?.registered || this.pairingInProgress.has(account.id);

    // Use whatever proxy is assigned to the account (or passed in). We now honor proxies
    // for pairing code flows when user says "use the proxy".
    const effectiveProxyRow = proxyRow;

    const socketConfig = {
      version,
      auth: state,
      printQRInTerminal: false, // we surface QR via events / API
      browser: DEFAULT_BROWSER,
      // More realistic desktop client for better companion acceptance on real phones
      waWebVersion: [2, 2412, 1], // match a recent official web version if possible
      connectTimeoutMs: 90000,
      keepAliveIntervalMs: 25000,
      logger: baileysLogger.child({ account: account.phone }),
      connectTimeoutMs: 60_000,
      defaultQueryTimeoutMs: 60_000,
      markOnlineOnConnect: false,
      // Helps with desktop-like linking in some cases (affects webInfo + history expectations)
      syncFullHistory: true,
      // Proxy injection + IPv4 fallback for WA websocket
      ...this._buildNetworkAgents(effectiveProxyRow),
    };

    if (isLikelyPairing) {
      const proxyInfo = effectiveProxyRow
        ? `USING PROXY id=${effectiveProxyRow.id} ${effectiveProxyRow.type}://${effectiveProxyRow.host}:${effectiveProxyRow.port}`
        : 'DIRECT (no proxy)';
      logger.info(`[PAIRING] Creating Baileys socket for ${account.phone} — ${proxyInfo} (MACOS UA platform patch is active)`);

      // Also log the proxy choice at transport level for maximum visibility during testing
      if (effectiveProxyRow) {
        logger.info(`[PAIRING-TRANSPORT] Pairing will go through proxy id=${effectiveProxyRow.id}`);
      }

      // Re-assert the platform patch (for 405 fix)
      try {
        const UA = proto?.ClientPayload?.UserAgent?.Platform;
        if (UA) UA.WEB = UA.MACOS;
      } catch {}
    }

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

      // Extra diagnostics for pairing troubleshooting (the main source of "couldn't link device")
      if (this.pairingInProgress.has(account.id)) {
        const sc = lastDisconnect?.error?.output?.statusCode;
        const data = lastDisconnect?.error?.data;
        logger.info(`[PAIRING-DEBUG] ${account.phone} update: conn=${connection || 'n/a'} qr=${!!qr} statusCode=${sc ?? ''} lastErr=${lastDisconnect?.error?.message || ''} data=${data ? JSON.stringify(data) : ''}`);
        if (connection === 'close') {
          const closeReason = lastDisconnect?.error?.message || data?.reason || 'unknown';
          logger.info(`[PAIRING] Socket closed for ${account.phone} via proxy: reason=${closeReason} status=${sc} data=${JSON.stringify(data)}`);
          if (data && data.reason) logger.info(`[PAIRING] Close data reason: ${data.reason}`);
          if (closeReason.includes('proxy') || closeReason.includes('NotAllowed') || closeReason.includes('Socks5')) {
            logger.warn(`[PAIRING] Proxy-level rejection for WhatsApp on this handshake.`);
          }
        }
      }

      if (connection === 'open') {
        logger.info(`Session OPEN for ${account.phone} (${account.id})`);

        const wasPending = ['pending_verification', 'pending_login', 'primary_registered'].includes(account.status);
        const isPhoneAssoc = account.acquisition_method === 'phone_assoc';

        const updatePatch = {
          status: 'linked',  // explicit linked stage after successful companion handshake
          last_linked_at: this.db.fn.now(),
          last_seen_at: this.db.fn.now(),
        };

        // Port allocation on success only (user request for transitional phone-first flows)
        // If this was a cloud / SMS-acquired number that was created without a port,
        // allocate one now (first available normal port with capacity).
        // Set display name from the linked session (comes from primary profile after successful link)
        if (account.display_name == null) {
          const user = sock.user || {};
          if (user.name || user.verifiedName) {
            updatePatch.display_name = user.name || user.verifiedName;
          }
        }

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
        const rem = this._pairingReminders.get(account.id);
        if (rem) { clearInterval(rem); this._pairingReminders.delete(account.id); }
        this.emit('connected', { accountId: account.id, phone: account.phone });
        this.reconnectDelays.delete(account.id);
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        const reason = lastDisconnect?.error?.message || 'unknown';
        const awaitingPairing = this.pairingInProgress.has(account.id);

        if (awaitingPairing) {
          logger.info(
            `Pairing wait for ${account.phone}: ${reason} — ENTER 8-DIGIT CODE NOW on primary WhatsApp. If you never got a push notification or code prompt on the phone, the server rejected Baileys' link request (see error logs above).`
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
              if (pinfo.reconnectAttempts > 20) {
                this.pairingInProgress.delete(account.id);
                const rem = this._pairingReminders.get(account.id);
                if (rem) { clearInterval(rem); this._pairingReminders.delete(account.id); }
                logger.error(
                  `Pairing abandoned for ${account.phone} after ${pinfo.reconnectAttempts} reconnects. ` +
                  'The code is likely invalid — wait 15 min, then request a fresh code (or use QR login).'
                );
                return;
              }
            }

            // Baileys wiki: WA forcibly disconnects after companion_hello — restartRequired is normal.
            // Use fast reconnects so a live socket is present when the user enters the code on the phone/emulator.
            if (statusCode === DisconnectReason.restartRequired) {
              delay = PAIRING_RESTART_RECONNECT_MS;
            } else if (reason.includes('Connection Terminated')) {
              delay = 800;
            } else if (reason.includes('Connection Failure')) {
              const statusCode = lastDisconnect?.error?.output?.statusCode;
              const failureData = lastDisconnect?.error?.data;
              logger.error(
                `PAIRING CONNECTION FAILURE for ${account.phone} (statusCode=${statusCode || 'unknown'}): ${JSON.stringify(failureData || {})}. ` +
                `This usually means the server REJECTED the companion_hello / pairing request. ` +
                `The 8-digit code was generated LOCALLY by Baileys and was NEVER registered with WhatsApp servers — that's why your phone gets no notification/prompt. ` +
                `Official WhatsApp Web works because it presents a trusted client fingerprint.`
              );
              // Back off more on hard failures during pairing initiation
              delay = Math.max(PAIRING_FAILURE_RECONNECT_MS, 8000);
            } else {
              delay = 1500;
            }
          }

          setTimeout(() => {
            this.getOrCreateSocket(account.id).catch((e) =>
              logger.error(`Reconnect failed for ${account.phone}`, e)
            ).then(() => {
              // If we just had a hard Connection Failure while trying to pair,
              // the previous code was never accepted by servers. Automatically
              // request a fresh one (this will reset partial state and emit a new
              // pairing_code + banner). This gives the operator a new chance
              // without manual re-curl.
              if (this.pairingInProgress.has(account.id) && reason.includes('Connection Failure')) {
                setTimeout(() => {
                  this.requestPairingCode(account.id, account.phone, { forceNew: true })
                    .then(newCode => logger.info(`Auto-generated fresh pairing code after failure: ${newCode}`))
                    .catch(err => logger.warn('Auto fresh pairing code attempt failed:', err.message));
                }, 1200);
              }
            });
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
    if (proxyRow) {
      // Log clearly when a proxy is selected for a pairing attempt
      if (this.pairingInProgress.size > 0 || !proxyRow) {
        // will be logged in more detail in _createSocketForAccount for pairing
      }
      return this._buildProxyConfig(proxyRow);
    }

    // Log for pairing visibility when going direct
    if (this.pairingInProgress.size > 0) {
      logger.info('[PAIRING-TRANSPORT] Using DIRECT IPv4 connection (no proxy) for WhatsApp websocket');
    }

    const agent = new https.Agent({ family: socketFamily, keepAlive: true });
    return { agent, fetchAgent: agent };
  }

  _buildProxyConfig(proxyRow) {
    const { id, type, host, port, username, password_enc } = proxyRow;
    // Decrypt the stored password so the proxy agent can authenticate
    let password;
    if (password_enc) {
      try { password = decrypt(password_enc); } catch (e) { /* ignore — will attempt without */ }
    }
    const auth = username ? `${encodeURIComponent(username)}:${encodeURIComponent(password || '')}@` : '';
    // Use socks5h for remote DNS resolution (critical for many residential proxies to reach WA domains)
    const proxyUrl = type === 'socks5'
      ? `socks5h://${auth}${host}:${port}`
      : `${type}://${auth}${host}:${port}`;

    if (this.pairingInProgress.size > 0) {
      logger.info(`[PAIRING-TRANSPORT] Using PROXY id=${id} for WhatsApp websocket: ${type}://${username ? username + ':***@' : ''}${host}:${port}`);
    }

    try {
      if (type === 'socks5') {
        const agent = new SocksProxyAgent(proxyUrl);
        return { agent, fetchAgent: agent };
      } else {
        const agent = new HttpsProxyAgent(proxyUrl);
        return { agent, fetchAgent: agent };
      }
    } catch (e) {
      logger.error('Failed to create proxy agent', { proxyId: id, error: e.message });
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

    // Resolve as soon as we have any sign of being in the pre-auth phase where
    // requestPairingCode is safe to call. This matches Baileys guidance.
    if (update.qr || update.connection === 'connecting' || update.connection === 'open') {
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
          'Timed out waiting for Baileys pairing phase. Try again or use QR login. (Common with rate limits or bad network/proxy)'
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
    const rem = this._pairingReminders.get(accountId);
    if (rem) { clearInterval(rem); this._pairingReminders.delete(accountId); }

    await this.db('ws_accounts')
      .where({ id: accountId })
      .update({ baileys_auth_state: null, status: 'primary_registered' }); // back to ready for fresh linking attempt
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
   * Request a pairing code for phone number association login (supports phone primary or cloud emulator primary).
   * Instead of showing a QR to scan, this returns an 8-digit code that you enter
   * directly in the WhatsApp app (running on your phone as primary, or in cloud emulator).
   * This enables more automated / phone-less registration flows.
   *
   * Usage flow for cloud:
   * 1. Provision Android emulator in cloud (Android-x86, Waydroid, etc.)
   * 2. Install WhatsApp, register the number using virtual SMS.
   * 3. Call this to get a pairing code.
   * 4. Enter the code in the WhatsApp app inside the emulator.
   * 5. Linking completes → auth state saved in DB → you can shut down the emulator.
   */
  async requestPairingCode(accountId, phoneNumber, { forceNew = false, forceDirect = false } = {}) {
    const existing = this.pairingInProgress.get(accountId);
    if (!forceNew && existing && Date.now() - existing.startedAt < PAIRING_CODE_TTL_MS) {
      logger.info(`Reusing in-flight pairing code for ${phoneNumber}: ${existing.code}`);
      return existing.code;
    }

    let account = await this.db('ws_accounts').where({ id: accountId }).first();
    if (forceDirect && account.proxy_id) {
      // For testing: temporarily force no proxy for this linking attempt
      await this.db('ws_accounts').where({ id: accountId }).update({ proxy_id: null });
      account = await this.db('ws_accounts').where({ id: accountId }).first();
      logger.info(`[PAIRING-TEST] forceDirect: cleared proxy for this attempt on ${phoneNumber}`);
    }

    // Guard: Baileys links as a companion. The primary WhatsApp must be registered first.
    // For the special test number we allow pure simulation (no real primary).
    // NOTE: 'linking' is included because the sessions controller sets status='linking' BEFORE
    // calling requestPairingCode (so the DB always shows 'linking' by the time we read it here).
    const isTestNoPhone = account.phone === '+13185167435';
    if (!isTestNoPhone && !['primary_registered', 'linking', 'linked', 'offline', 'error'].includes(account.status)) {
      throw new Error(`Cannot request pairing: ${account.phone} is not primary_registered (status=${account.status}). If using phone as primary: register in WhatsApp on phone then --mark-registered. If emulator primary: complete registration first.`);
    }

    logger.info(`[PAIRING] FRESH requestPairingCode for ${phoneNumber} (always clean state) — proxy=${account?.proxy_id || 'none'}`);
    if (account?.proxy_id) {
      logger.info(`[PAIRING] Proxy ID ${account.proxy_id} will be used for this Baileys connection`);
    }
    // Rocket-style: every single linking attempt must be a completely fresh "new device" handshake.
    // We force a clean auth state (no previous me/pairingCode) and clear in-memory state.
    await this._resetPairingAuth(accountId);

    // Official Baileys flow: arm waiter first, then create socket, wait for QR/connecting, then request code.
    // IMPORTANT: The early 'connecting' emit in Baileys is just a nextTick placeholder (before ws open + noise handshake).
    // We must wait for real socket open + protocol progress before sending the link_code_companion_reg (companion_hello).
    // Otherwise the server immediately closes with Connection Failure and the locally-generated code is never registered → phone gets zero notification.
    const pairingReady = this._armPairingReadyWait(accountId);
    let sock = await this.getOrCreateSocket(accountId);
    logger.info(`[PAIRING] Socket created for ${phoneNumber} (via proxy), awaiting ready...`);

    // Add timeout so the HTTP request to /connect doesn't hang forever when the proxy
    // connection is slow or unsupported. This prevents "empty reply from server".
    const SOCKET_READY_TIMEOUT_MS = 30000;
    const timeoutErr = new Error(
      `Timed out waiting for socket ready through proxy after ${SOCKET_READY_TIMEOUT_MS}ms. ` +
      `Check if this specific proxy pool allows web.whatsapp.com (many "res-any" pools are blocked by WA). ` +
      `Test: curl -v --socks5-hostname user:pass@host:port -I https://web.whatsapp.com`
    );

    try {
      await Promise.race([
        pairingReady,
        new Promise((_, rej) => setTimeout(() => rej(timeoutErr), SOCKET_READY_TIMEOUT_MS))
      ]);
    } catch (e) {
      if (e === timeoutErr) throw e;
      logger.warn(`Pairing ready wait issue for ${phoneNumber}: ${e.message} — proceeding`);
    }

    logger.info(`[PAIRING] Ready event, awaiting socket open...`);
    try {
      await Promise.race([
        sock.waitForSocketOpen(),
        new Promise((_, rej) => setTimeout(() => rej(timeoutErr), SOCKET_READY_TIMEOUT_MS))
      ]);
      logger.info(`[PAIRING] Socket open succeeded for ${phoneNumber}`);
    } catch (e) {
      if (e === timeoutErr) throw e;
      // Socket closed/errored before open — common when proxy is incompatible or IP is flagged.
      // Don't retry blindly; surface the real error so the operator can change proxy.
      const proxyHint = account.proxy_id
        ? ` (proxy ${account.proxy_id} — try forceDirect:true or a different proxy)`
        : ' (direct connection)';
      logger.error(`[PAIRING] Socket failed to open for ${phoneNumber}${proxyHint}: ${e.message}`);
      throw new Error(`Socket failed before pairing code could be requested: ${e.message}${proxyHint}`);
    }

    // Now wait for more handshake progress using Baileys' helper (or timeout).
    // 'receivedPendingNotifications' or staying in 'connecting' without immediate failure is a decent signal.
    console.log(`[PAIRING] Additional settle wait for ${phoneNumber}...`);
    try {
      await Promise.race([
        Promise.race([
          sock.waitForConnectionUpdate((u) => u.receivedPendingNotifications === true || u.connection === 'connecting', 10_000),
          new Promise(r => setTimeout(r, 2500))
        ]),
        new Promise((_, rej) => setTimeout(() => rej(timeoutErr), SOCKET_READY_TIMEOUT_MS))
      ]);
    } catch (e) {
      if (e === timeoutErr) throw e;
    }

    // Longer settle time after the real ws + initial protocol handshake. This is critical for the pairing IQ to be accepted.
    await new Promise(r => setTimeout(r, 1200));

    console.log(`[PAIRING] Calling Baileys requestPairingCode for ${phoneNumber}...`);
    let code;
    try {
      const codeTimeout = new Error(`requestPairingCode timed out after 25s — socket may be open but WA not responding (proxy interference?)`);
      code = await Promise.race([
        sock.requestPairingCode(phoneNumber.replace(/[^0-9]/g, '')),
        new Promise((_, rej) => setTimeout(() => rej(codeTimeout), 25000))
      ]);
    } catch (e) {
      if (e.message && e.message.includes('proxy rejected')) {
        throw new Error('The SOCKS5 proxy rejected the connection to WhatsApp. Try forceDirect:true or a different proxy.');
      }
      throw e;
    }

    logger.info(`[PAIRING] client-side code generated + companion_hello IQ sent for ${phoneNumber}. MACOS UA patch active. Proxy (if any) is logged above in [PAIRING] line.`);

    this.pairingInProgress.set(accountId, {
      phone: phoneNumber,
      code,
      startedAt: Date.now(),
      reconnectAttempts: 0,
    });

    this.emit('pairing_code', { accountId, phone: phoneNumber, code });

    // Proxy status (if any) is logged in the [PAIRING] Creating socket line above
    console.log(`[PAIRING] Proxy status for ${phoneNumber} is shown in the logs above (DIRECT or proxy=...). MACOS patch active.`);
    this._showPairingCodeBanner(phoneNumber, code);

    // Start / refresh a reminder interval so the code stays highly visible in server logs
    // while testing via curl / scripts (user pastes into phone emulator).
    this._startPairingReminder(accountId, phoneNumber, code);

    return code;
  }

  /**
   * Print a loud, copy-paste friendly banner so the pairing code is impossible to miss
   * when testing via curl / CLI (user requested visibility while testing).
   */
  _showPairingCodeBanner(phoneNumber, code) {
    const border = '='.repeat(72);
    const msg = [
      '',
      border,
      '  WHATSAPP PAIRING CODE (client-generated) — PHONE MUST RECEIVE NOTIFICATION',
      border,
      `  Phone : ${phoneNumber}`,
      `  CODE  : ${code}`,
      '',
      '  IMPORTANT: This 8-digit code is GENERATED LOCALLY by Baileys (bytesToCrockford).',
      '  WhatsApp servers do NOT "return" the code to you. It only becomes valid if the',
      '  companion_hello link request succeeds and WA registers a pending link for the phone.',
      '',
      '  On the PRIMARY phone (the actual WhatsApp app with this number logged in):',
      '    • You should get a push notification or "new device link" prompt within seconds.',
      '    • Then: Linked Devices → Link a Device → "Link with phone number instead"',
      '    • Enter the code above.',
      '',
      '  If the phone gets ZERO notification/prompt even after 10s:',
      '    → The server closed with Connection Failure before/during the hello send.',
      '    → This local code will do nothing. Check the [PAIRING-DEBUG] + error logs.',
      '    → MACOS UA patch is active. Proxy usage (or DIRECT) is logged clearly on server startup of the socket.',
      '',
      '  Keep the server running. A later fresh request may succeed after changes.',
      border,
      ''
    ].join('\n');
    console.log(msg);
    logger.warn(`PAIRING: ${phoneNumber} → ${code}  (watch phone for notification NOW)`);
  }

  _startPairingReminder(accountId, phoneNumber, code) {
    // Clear any prior for this account
    const prev = this._pairingReminders.get(accountId);
    if (prev) clearInterval(prev);

    let ticks = 0;
    const iv = setInterval(() => {
      const still = this.pairingInProgress.get(accountId);
      if (!still || still.code !== code) {
        clearInterval(iv);
        this._pairingReminders.delete(accountId);
        return;
      }
      ticks++;
      // Every ~8s echo a compact visible reminder (easy to spot in logs while testing)
      if (ticks % 1 === 0) {
        console.log(`[PAIRING CODE] ${phoneNumber} : ${code}   ← if phone never showed a link prompt, this code was rejected by server (no notification sent)`);
        logger.info(`[REMINDER] Waiting for pairing code entry: ${code} for ${phoneNumber} (check if phone received link prompt)`);
      }
      // After ~90s still pending, warn about expiration
      if (ticks > 11) {
        logger.warn(`Pairing code ${code} for ${phoneNumber} is still pending after ~90s — it may be expiring.`);
      }
    }, 8000);

    this._pairingReminders.set(accountId, iv);

    // Auto cleanup if someone forgets (safety)
    setTimeout(() => {
      if (this._pairingReminders.get(accountId) === iv) {
        clearInterval(iv);
        this._pairingReminders.delete(accountId);
      }
    }, 180_000);
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

  /**
   * For testing / observability: return currently issued pairing codes that
   * are still waiting to be entered on the phone. Very useful when using curl
   * so you have a way to "see" the live codes without the frontend.
   */
  getPairingCodes() {
    const out = [];
    for (const [accountId, info] of this.pairingInProgress.entries()) {
      // Best effort: include proxy info so it's visible via /pairing-codes even for curl users
      // (we don't have the live account here, but caller in controller can enrich if wanted)
      out.push({
        accountId,
        phone: info.phone,
        code: info.code,
        startedAt: info.startedAt,
        ageSeconds: Math.floor((Date.now() - info.startedAt) / 1000),
        reconnectAttempts: info.reconnectAttempts || 0,
      });
    }
    return out;
  }

  // Called on shutdown
  async shutdownAll() {
    for (const [id, entry] of activeSockets) {
      try { entry.sock?.end(); } catch {}
    }
    activeSockets.clear();
    for (const iv of this._pairingReminders.values()) clearInterval(iv);
    this._pairingReminders.clear();
  }
}

export default SessionManager;
