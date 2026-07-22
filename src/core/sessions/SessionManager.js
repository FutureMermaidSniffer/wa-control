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
  generateMessageIDV2,
  WAMessageStatus,
} from '@whiskeysockets/baileys';
import { proto } from '@whiskeysockets/baileys/WAProto/index.js';
import portsData from '../../data/ports.data.js';

// Store original WEB platform so we can scope the MACOS spoof to pairing only.
// Global forever-patch on Linux caused inconsistent identity after QR link.
let _platformWebOriginal = null;
try {
  const UA = proto?.ClientPayload?.UserAgent?.Platform;
  if (UA && _platformWebOriginal === null) {
    _platformWebOriginal = UA.WEB;
  }
} catch {}

function applyPairingPlatformPatch() {
  // WA_FORCE_MACOS_PLATFORM=false disables spoof entirely
  if (process.env.WA_FORCE_MACOS_PLATFORM === 'false') return;
  try {
    const UA = proto?.ClientPayload?.UserAgent?.Platform;
    if (UA && UA.MACOS != null) {
      UA.WEB = UA.MACOS;
      logger.info('[WA-PATCH] Pairing mode: UserAgent.Platform.WEB → MACOS (temporary)');
    }
  } catch (e) {
    logger.warn('[WA-PATCH] Could not apply pairing platform patch: ' + e.message);
  }
}

function restorePlatformPatch() {
  try {
    const UA = proto?.ClientPayload?.UserAgent?.Platform;
    if (UA && _platformWebOriginal != null) {
      UA.WEB = _platformWebOriginal;
    }
  } catch {}
}

/** Cache fetchLatestBaileysVersion — network call can add seconds to QR wait. */
let _cachedWaVersion = null;
let _cachedWaVersionAt = 0;
const WA_VERSION_TTL_MS = 6 * 60 * 60 * 1000;

async function getWaVersion() {
  if (_cachedWaVersion && Date.now() - _cachedWaVersionAt < WA_VERSION_TTL_MS) {
    return _cachedWaVersion;
  }
  const { version } = await fetchLatestBaileysVersion();
  _cachedWaVersion = version;
  _cachedWaVersionAt = Date.now();
  return version;
}
import https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { EventEmitter } from 'events';
import fs from 'fs/promises';
import path from 'path';
import QRCode from 'qrcode';
import { logger } from '../../utils/logger.js';
import { encrypt, decrypt } from '../../utils/encryption.js';
import config from '../../config/index.js';
import { HandshakeRejectedError, InFlightHandshakeError } from './errors.js';
import pino from 'pino';
import { normalizeWaPhone } from '../../utils/phone.js';

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

/** Enforce HANDSHAKE_WAIT_MS >= HANDSHAKE_WEAK_ACCEPT_MS (clamp when misconfigured). */
export function resolveHandshakeTimerMs(waitMs, weakMs) {
  let handshakeWaitMs = waitMs;
  const handshakeWeakAcceptMs = weakMs;
  if (handshakeWaitMs < handshakeWeakAcceptMs) {
    logger.warn(
      `HANDSHAKE_WAIT_MS (${handshakeWaitMs}) < HANDSHAKE_WEAK_ACCEPT_MS (${handshakeWeakAcceptMs}); clamping`
    );
    handshakeWaitMs = handshakeWeakAcceptMs + 3000;
  }
  return { handshakeWaitMs, handshakeWeakAcceptMs };
}

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
    /**
     * Latest QR challenge per account (OpenWA-style poll + WS).
     * @type {Map<string, { qr: string, qrDataUrl: string|null, at: number }>}
     */
    this.latestQr = new Map();
    /** Accounts currently in explicit QR link mode (not pairing). */
    this.qrLinkInProgress = new Set();
    /** Single-flight create promises — prevent dual sockets (conflict/replaced). */
    this._connectingLocks = new Map();
    /** Pending reconnect timers per account. */
    this._reconnectTimers = new Map();
    /** Last time we emitted 'connected' (debounce toast spam). */
    this._lastConnectedEmit = new Map();
    /** Intentionally stopped accounts — do not auto-reconnect. */
    this._stopReconnect = new Set();
    /** Per-account socket generation — ignore events from superseded sockets. */
    this._socketGeneration = new Map();

    // Handshake verification gate (local Update 20th)
    this.handshakeGateEnabled = config.PAIRING_HANDSHAKE_GATE === '1';
    this.allowWeakWithGate = config.HANDSHAKE_ALLOW_WEAK_WITH_GATE === '1';
    this.pairingHelloAttempts = config.PAIRING_HELLO_ATTEMPTS || 3;
    this.pairingAutoRetryOnFailure = config.PAIRING_AUTO_RETRY_ON_FAILURE !== '0';

    const timers = resolveHandshakeTimerMs(config.HANDSHAKE_WAIT_MS, config.HANDSHAKE_WEAK_ACCEPT_MS);
    this.HANDSHAKE_WAIT_MS = timers.handshakeWaitMs;
    this.HANDSHAKE_WEAK_ACCEPT_MS = timers.handshakeWeakAcceptMs;

    /** @type {Map<string, { resolve, reject, timeout, weakTimer, startedAt, phone }>} */
    this._handshakeWaiters = new Map();
    /** accountId -> true while _teardownFailedPairing is in progress (dedupe) */
    this._teardownInFlight = new Set();
    /** @type {Map<string, { phone, status, startedAt, reason?, statusCode?, handshakeWaitMs?, code?: string }>} */
    this._handshakePhase = new Map();
    /** @type {Map<string, Promise>} */
    this._handshakeInFlight = new Map();
    /** Accounts where reconnect must not run after a failed pairing handshake (stops QR spam / 401 loops). */
    this._suppressReconnect = new Set();
    /** Consecutive non-pairing close failures (403 storms) — capped then cooldown */
    this._sessionFailCounts = new Map();
  }

  _clearReconnectTimer(accountId) {
    const t = this._reconnectTimers.get(accountId);
    if (t) {
      clearTimeout(t);
      this._reconnectTimers.delete(accountId);
    }
  }

  _endSocketQuietly(sock) {
    if (!sock) return;
    try {
      sock.ev?.removeAllListeners?.();
    } catch {}
    try {
      sock.end?.(undefined);
    } catch {}
  }

  /**
   * Wait until Baileys reports connection open (or timeout).
   * @param {string} accountId
   * @param {number} [timeoutMs]
   */
  async _waitForSocketOpen(accountId, timeoutMs = 45000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const entry = activeSockets.get(accountId);
      if (entry?.sock?.ws?.isOpen && !entry.dead) return entry.sock;
      if (entry?.dead) break;
      await new Promise((r) => setTimeout(r, 250));
    }
    if (this.isSocketLive(accountId)) return activeSockets.get(accountId).sock;
    throw new Error(
      `Session for ${accountId} did not open within ${timeoutMs}ms — reconnect or re-link required`
    );
  }

  /**
   * Get a live (ws open) socket for an account. Creates/connects if necessary.
   * Never returns a half-dead / mid-close socket for callers that need messaging.
   * Single-flight: concurrent callers share one create promise.
   * @param {string} accountId
   * @param {{ waitOpen?: boolean, openTimeoutMs?: number }} [opts]
   * @returns {Promise<any>} the Baileys socket
   */
  async getOrCreateSocket(accountId, opts = {}) {
    const waitOpen = opts.waitOpen !== false;
    const openTimeoutMs = opts.openTimeoutMs ?? 45000;

    if (activeSockets.has(accountId)) {
      const entry = activeSockets.get(accountId);
      if (entry.sock?.ws?.isOpen && !entry.dead) return entry.sock;
      // Mid-handshake: wait for open instead of handing back a closed/closing sock
      if (entry.sock && !entry.dead && waitOpen) {
        try {
          return await this._waitForSocketOpen(accountId, openTimeoutMs);
        } catch {
          this._endSocketQuietly(entry.sock);
          activeSockets.delete(accountId);
        }
      } else {
        this._endSocketQuietly(entry.sock);
        activeSockets.delete(accountId);
      }
    }

    if (this._connectingLocks.has(accountId)) {
      const sock = await this._connectingLocks.get(accountId);
      if (waitOpen && sock && !sock.ws?.isOpen) {
        return this._waitForSocketOpen(accountId, openTimeoutMs);
      }
      if (sock?.ws?.isOpen) return sock;
      // fall through to recreate
    }

    const createPromise = (async () => {
      try {
        this._stopReconnect.delete(accountId);
        this._clearReconnectTimer(accountId);

        // Kill any stale entry that appeared during await races
        if (activeSockets.has(accountId)) {
          const existing = activeSockets.get(accountId);
          if (existing.sock?.ws?.isOpen && !existing.dead) return existing.sock;
          this._endSocketQuietly(existing.sock);
          activeSockets.delete(accountId);
        }

        const account = await this.db('ws_accounts')
          .where({ id: accountId })
          .first();

        if (!account) throw new Error(`ws_account ${accountId} not found`);

        const proxy = account.proxy_id
          ? await this.db('proxies').where({ id: account.proxy_id }).first()
          : null;

        const gen = (this._socketGeneration.get(accountId) || 0) + 1;
        this._socketGeneration.set(accountId, gen);
        const sock = await this._createSocketForAccount(account, proxy, gen);
        activeSockets.set(accountId, { sock, account, proxy, dead: false, gen });
        if (waitOpen && !sock?.ws?.isOpen) {
          return this._waitForSocketOpen(accountId, openTimeoutMs);
        }
        return sock;
      } finally {
        this._connectingLocks.delete(accountId);
      }
    })();

    this._connectingLocks.set(accountId, createPromise);
    return createPromise;
  }

  async _createSocketForAccount(account, proxyRow, gen = 1) {
    const { state, saveCreds } = await this._getAuthState(account);

    const version = await getWaVersion();

    // Only treat as pairing when explicitly in pairing mode (not every unregistered reconnect)
    const isPairingMode = this.pairingInProgress.has(account.id);
    const isQrMode = this.qrLinkInProgress.has(account.id);
    const effectiveProxyRow = proxyRow;

    // MACOS platform spoof ONLY for pairing (helps companion_hello). QR/restore use real WEB enum.
    if (isPairingMode) {
      applyPairingPlatformPatch();
    } else {
      restorePlatformPatch();
    }

    // Pairing must use a browser name that maps in DeviceProps.PlatformType
    // (getPlatformId(browser[1])). 'Desktop' → unknown → falls back to "1"; 'Chrome' is correct.
    const browserTuple = isPairingMode
      ? Browsers.macOS('Chrome')
      : DEFAULT_BROWSER;

    // In-memory recent messages for Baileys getMessage (retries / "taking a while")
    if (!this._msgCache) this._msgCache = new Map(); // accountId -> Map(msgId -> content)
    const accountMsgCache = (() => {
      if (!this._msgCache.has(account.id)) this._msgCache.set(account.id, new Map());
      return this._msgCache.get(account.id);
    })();
    const cacheMessage = (key, content) => {
      if (!key?.id || !content) return;
      accountMsgCache.set(key.id, content);
      // Cap per-account cache
      if (accountMsgCache.size > 500) {
        const first = accountMsgCache.keys().next().value;
        accountMsgCache.delete(first);
      }
    };

    const socketConfig = {
      version,
      auth: state,
      printQRInTerminal: false,
      browser: browserTuple,
      // Do not pin ancient waWebVersion — use fetched `version` only
      keepAliveIntervalMs: 25000,
      logger: baileysLogger.child({ account: account.phone }),
      connectTimeoutMs: 60_000,
      defaultQueryTimeoutMs: 60_000,
      markOnlineOnConnect: true,
      // Avoid heavy full history sync on every reconnect (reduces init-query timeouts under flap)
      syncFullHistory: false,
      // Required so failed deliveries can be retried (reduces "message can take a while" / bad acks)
      getMessage: async (key) => {
        if (!key?.id) return undefined;
        const cached = accountMsgCache.get(key.id);
        if (cached) return cached;
        try {
          const row = await this.db('messages')
            .where({ ws_account_id: account.id, wa_message_id: key.id })
            .first();
          if (row?.raw?.message) return row.raw.message;
          if (row?.text && !String(row.text).startsWith('[FAILED]')) {
            return { conversation: row.text };
          }
        } catch { /* ignore */ }
        return undefined;
      },
      ...this._buildNetworkAgents(effectiveProxyRow),
    };

    const proxyInfo = effectiveProxyRow
      ? `proxy id=${effectiveProxyRow.id} ${effectiveProxyRow.type}://${effectiveProxyRow.host}:${effectiveProxyRow.port}`
      : 'DIRECT';
    if (isPairingMode) {
      logger.info(`[PAIRING] Creating Baileys socket for ${account.phone} — ${proxyInfo} gen=${gen}`);
    } else if (isQrMode) {
      logger.info(`[QR-LINK] Creating Baileys socket for ${account.phone} — ${proxyInfo} gen=${gen}`);
    } else {
      logger.info(`[SESSION] Creating/restoring Baileys socket for ${account.phone} — ${proxyInfo} registered=${!!state?.creds?.registered} gen=${gen}`);
    }

    const sock = makeWASocket(socketConfig);

    // Wire core events — ignore if this socket was superseded (prevents conflict storms)
    const isCurrentGen = () => this._socketGeneration.get(account.id) === gen;

    sock.ev.on('connection.update', async (update) => {
      if (!isCurrentGen()) {
        logger.info(`Ignoring connection.update from superseded socket gen=${gen} for ${account.phone}`);
        return;
      }
      const { connection, lastDisconnect, qr } = update;

      // Only surface QR during explicit QR link, or unregistered auth (never spam when already linked)
      if (qr) {
        const registered = !!state?.creds?.registered;
        const explicitQr = this.qrLinkInProgress.has(account.id);
        if (explicitQr || (!registered && !this.pairingInProgress.has(account.id))) {
          void this._publishQr(account, qr);
        } else {
          logger.info(`Suppressing QR for ${account.phone} (registered=${registered}, explicitQr=${explicitQr})`);
        }
      }

      this._resolvePairingReady(account.id, update);

      // Handshake gate: track post-pairing QR fallback + resolve waiters
      if (this._handshakeWaiters.has(account.id)) {
        const hw = this._handshakeWaiters.get(account.id);
        if (qr && hw?.companionHelloSent) {
          hw.postPairingQrSeen = true;
          logger.warn(`[PAIRING-HANDSHAKE] Post-pairing QR seen for ${account.phone} — companion_hello likely not accepted`);
          void this._rejectHandshakeWait(account.id, {
            handshakeStatus: 'rejected',
            reason: 'post_pairing_qr_fallback',
            message: 'WhatsApp fell back to QR after pairing request',
          }).catch(() => {});
        } else {
          void this._resolveHandshakeWait(account.id, update).catch((e) => {
            logger.warn(`[PAIRING-HANDSHAKE] resolve failed for ${account.phone}: ${e.message}`);
          });
        }
      }

      if (this.pairingInProgress.has(account.id)) {
        const sc = lastDisconnect?.error?.output?.statusCode;
        const data = lastDisconnect?.error?.data;
        logger.info(`[PAIRING-DEBUG] ${account.phone} update: conn=${connection || 'n/a'} qr=${!!qr} statusCode=${sc ?? ''} lastErr=${lastDisconnect?.error?.message || ''} data=${data ? JSON.stringify(data) : ''}`);
      }

      if (connection === 'open') {
        logger.info(`Session OPEN for ${account.phone} (${account.id})`);

        this._clearReconnectTimer(account.id);
        this._stopReconnect.delete(account.id);
        this._sessionFailCounts.set(account.id, 0);

        const wasQrLink = this.qrLinkInProgress.has(account.id);
        const wasPairing = this.pairingInProgress.has(account.id);
        // Clear link challenges — session is live
        this.latestQr.delete(account.id);
        this.qrLinkInProgress.delete(account.id);
        this.pairingInProgress.delete(account.id);
        const rem = this._pairingReminders.get(account.id);
        if (rem) { clearInterval(rem); this._pairingReminders.delete(account.id); }

        // Fresh read: status may have been updated to 'linking' after socket create
        const fresh = await this.db('ws_accounts').where({ id: account.id }).first();
        const statusNow = fresh?.status || account.status;
        const alreadyLinked = ['linked', 'active'].includes(statusNow);
        const wasPending = ['pending_verification', 'pending_login', 'primary_registered', 'linking', 'offline', 'error'].includes(statusNow);
        const isPhoneAssoc = (fresh?.acquisition_method || account.acquisition_method) === 'phone_assoc'
          || (fresh?.acquisition_method || account.acquisition_method) === 'scan_linked';
        const needsPort = (wasPending || isPhoneAssoc || wasQrLink || wasPairing) && !(fresh?.port_id || account.port_id);

        const updatePatch = {
          status: 'linked',
          last_linked_at: this.db.fn.now(),
          last_seen_at: this.db.fn.now(),
        };

        if (!(fresh?.display_name || account.display_name)) {
          const user = sock.user || {};
          if (user.name || user.verifiedName) {
            updatePatch.display_name = user.name || user.verifiedName;
          }
        }

        if (needsPort) {
          try {
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
              logger.warn('No available port to allocate on link success', {
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

        this.reconnectDelays.delete(account.id);

        // Debounce connected events — avoid "linked successfully" toast spam on flap
        const lastEmit = this._lastConnectedEmit.get(account.id) || 0;
        const now = Date.now();
        const isFirstLink = !alreadyLinked || wasQrLink || wasPairing;
        if (isFirstLink || now - lastEmit > 15_000) {
          this._lastConnectedEmit.set(account.id, now);
          this.emit('connected', {
            accountId: account.id,
            phone: account.phone,
            reconnected: alreadyLinked && !wasQrLink && !wasPairing,
          });
        } else {
          logger.info(`Suppressed duplicate connected emit for ${account.phone}`);
        }
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const reason = lastDisconnect?.error?.message || 'unknown';
        const data = lastDisconnect?.error?.data;
        const isLoggedOut = statusCode === DisconnectReason.loggedOut;
        const isConflict = /conflict/i.test(reason)
          || data?.tag === 'conflict'
          || (Array.isArray(data) && data.some?.((n) => n?.tag === 'conflict'))
          || /replaced/i.test(JSON.stringify(data || {}));
        const awaitingPairing = this.pairingInProgress.has(account.id);
        const intentionalStop = this._stopReconnect.has(account.id);

        // Only drop map entry if this sock is still the active one
        const entry = activeSockets.get(account.id);
        if (entry?.sock === sock) {
          entry.dead = true;
          activeSockets.delete(account.id);
        }

        if (awaitingPairing) {
          logger.info(
            `Pairing wait for ${account.phone}: ${reason} — ENTER 8-DIGIT CODE NOW on primary WhatsApp.`
          );
        } else {
          logger.warn(
            `Session CLOSED for ${account.phone}: ${reason} ` +
            `(conflict=${isConflict}, loggedOut=${isLoggedOut}, statusCode=${statusCode ?? 'n/a'}, gen=${gen}, ` +
            `active=${activeSockets.size}, pairing=${awaitingPairing}, reconnect=${!isLoggedOut && !intentionalStop})`
          );
        }

        // Status policy:
        // - loggedOut (401): only true unlink — mark offline and clear auth
        // - intentional stop (shutdown): leave as linked if auth still present (browser close ≠ logout)
        // - transient close: keep linked/linking so UI doesn't flash "error"
        if (isLoggedOut) {
          await this.db('ws_accounts')
            .where({ id: account.id })
            .update({ status: 'offline', baileys_auth_state: null });
          logger.warn(`Logged out by WhatsApp for ${account.phone} — need re-link`);
        }
        // else: keep DB status (linked) so closing the browser/page does not mark error

        this.emit('disconnected', {
          accountId: account.id,
          phone: account.phone,
          reason,
          shouldReconnect: !isLoggedOut && !intentionalStop,
          conflict: isConflict,
        });

        const suppressReconnect = this._suppressReconnect.has(account.id);

        if (isLoggedOut || intentionalStop || suppressReconnect) {
          this._clearReconnectTimer(account.id);
          this.pairingInProgress.delete(account.id);
          this.qrLinkInProgress.delete(account.id);
          if (suppressReconnect) {
            logger.info(`Suppressing auto-reconnect for ${account.phone} after failed pairing handshake`);
            this._suppressReconnect.delete(account.id);
          }
          return;
        }

        // Schedule single reconnect (cancel previous timer first)
        let delay = this._getBackoff(account.id);

        // Cap non-pairing reconnect storms (e.g. endless 403 loops)
        if (!awaitingPairing) {
          const fails = (this._sessionFailCounts.get(account.id) || 0) + 1;
          this._sessionFailCounts.set(account.id, fails);
          const MAX_FAILS = parseInt(process.env.SESSION_RECONNECT_MAX_FAILS || '12', 10);
          const COOLDOWN_MS = parseInt(process.env.SESSION_RECONNECT_COOLDOWN_MS || String(15 * 60 * 1000), 10);
          if (fails === 1 || fails % 5 === 0) {
            logger.warn(
              `[SESSION] ${account.phone} close #${fails} statusCode=${statusCode ?? 'n/a'} ` +
              `data=${data ? JSON.stringify(data) : 'n/a'}`
            );
          }
          if (fails > MAX_FAILS) {
            logger.error(
              `[SESSION] ${account.phone} exceeded ${MAX_FAILS} reconnect failures ` +
              `(last statusCode=${statusCode ?? 'n/a'}) — pausing ${Math.round(COOLDOWN_MS / 60000)}min. ` +
              `Use Reconnect later or re-link if WhatsApp removed the device.`
            );
            this._sessionFailCounts.set(account.id, 0);
            this._clearReconnectTimer(account.id);
            // Long pause then allow one more cycle
            const coolTimer = setTimeout(() => {
              this._reconnectTimers.delete(account.id);
              if (this._stopReconnect.has(account.id)) return;
              this.getOrCreateSocket(account.id, { waitOpen: false }).catch((e) =>
                logger.error(`Cooldown-down reconnect failed for ${account.phone}`, e)
              );
            }, COOLDOWN_MS);
            this._reconnectTimers.set(account.id, coolTimer);
            return;
          }
          // Back off harder on 403 (forbidden / bad session path)
          if (statusCode === 403) {
            delay = Math.max(delay, 20_000 + Math.min(fails, 10) * 5_000);
          }
        }

        if (isConflict) {
          // Another socket stole the session (often ourselves). Back off hard.
          delay = Math.max(delay, 15_000);
          logger.warn(`Conflict/replaced for ${account.phone} — backing off ${delay}ms before single reconnect`);
        }

        if (awaitingPairing) {
          const pinfo = this.pairingInProgress.get(account.id);
          if (pinfo) {
            pinfo.reconnectAttempts = (pinfo.reconnectAttempts || 0) + 1;
            if (pinfo.reconnectAttempts > 20) {
              this.pairingInProgress.delete(account.id);
              const rem2 = this._pairingReminders.get(account.id);
              if (rem2) { clearInterval(rem2); this._pairingReminders.delete(account.id); }
              logger.error(
                `Pairing abandoned for ${account.phone} after ${pinfo.reconnectAttempts} reconnects. Use QR login.`
              );
              return;
            }
          }
          if (statusCode === DisconnectReason.restartRequired) {
            delay = PAIRING_RESTART_RECONNECT_MS;
          } else if (reason.includes('Connection Terminated')) {
            delay = 800;
          } else if (reason.includes('Connection Failure')) {
            logger.error(
              `PAIRING CONNECTION FAILURE for ${account.phone} (statusCode=${statusCode || 'unknown'}). ` +
              `Prefer QR link if pairing code does not reach the phone.`
            );
            delay = Math.max(PAIRING_FAILURE_RECONNECT_MS, 8000);
          } else {
            delay = Math.max(delay, 1500);
          }
        }

        this._clearReconnectTimer(account.id);
        const timer = setTimeout(() => {
          this._reconnectTimers.delete(account.id);
          // Bail if another socket already came up
          const cur = activeSockets.get(account.id);
          if (cur?.sock?.ws?.isOpen && !cur.dead) {
            logger.info(`Skip reconnect for ${account.phone} — already open`);
            this._sessionFailCounts.set(account.id, 0);
            return;
          }
          if (this._stopReconnect.has(account.id)) return;

          this.getOrCreateSocket(account.id, { waitOpen: false }).catch((e) =>
            logger.error(`Reconnect failed for ${account.phone}`, e)
          ).then(() => {
            // Do NOT auto forceNew pairing code while user may still be typing the current code.
            if (
              this.pairingInProgress.has(account.id)
              && reason.includes('Connection Failure')
              && !state?.creds?.registered
            ) {
              const p = this.pairingInProgress.get(account.id);
              logger.warn(
                `[PAIRING] Connection Failure while pairing ${account.phone}. ` +
                `Keeping code ${p?.code || '(none)'} — do not request a new code unless operator clicks Link again.`
              );
            }
          });
        }, delay);
        this._reconnectTimers.set(account.id, timer);
      }
    });

    sock.ev.on('creds.update', (...args) => {
      if (!isCurrentGen()) return;
      return saveCreds(...args);
    });

    // Basic message handler — forward to desk / jobs
    sock.ev.on('messages.upsert', (m) => {
      if (!isCurrentGen()) return;
      if (m.type === 'notify' || m.type === 'append') {
        for (const msg of m.messages || []) {
          if (msg?.key?.id && msg.message) cacheMessage(msg.key, msg.message);
        }
        this.emit('messages.upsert', { accountId: account.id, messages: m.messages });
      }
    });

    // Surface WA delivery acks/nacks (e.g. 463 reach-out lock) — resolve send waiters + emit status
    sock.ev.on('messages.update', (updates) => {
      if (!isCurrentGen()) return;
      for (const u of updates || []) {
        const stub = u.update?.messageStubParameters;
        const status = u.update?.status;
        const id = u.key?.id;
        const remoteJid = u.key?.remoteJid;
        const stubStrs = Array.isArray(stub) ? stub.map((s) => String(s)) : [];
        const errCode = stubStrs.find((s) => s === '463' || /463/.test(s)) || null;
        const isError = status === WAMessageStatus.ERROR || status === 0 || !!errCode;

        if (stubStrs.length || isError || (status != null && status >= WAMessageStatus.SERVER_ACK)) {
          logger[isError ? 'warn' : 'info']('[SEND-ACK]', {
            accountId: account.id,
            phone: account.phone,
            id,
            remoteJid,
            status,
            stub: stubStrs,
          });
        }

        // Always fan out status for desk ticks / DB (even without a waiter)
        if (id) {
          this.emit('message.status', {
            accountId: account.id,
            waMessageId: id,
            remoteJid,
            status: status ?? null,
            errorCode: errCode || (isError ? String(status) : null),
            failed: isError,
          });
        }

        if (id && this._sendAckWaiters?.has(id)) {
          const waiter = this._sendAckWaiters.get(id);
          if (errCode || (isError && stubStrs.some((s) => s.includes('463')))) {
            const e = new Error(
              `WhatsApp rejected delivery (ack 463 / reach-out locked) to ${remoteJid || 'peer'}. ` +
              `Message was NOT accepted for immediate delivery — contact may receive it much later or never.`
            );
            e.code = 'WA_ACK_463';
            e.waStatus = status;
            e.remoteJid = remoteJid;
            waiter.reject(e);
          } else if (isError) {
            const e = new Error(
              `WhatsApp delivery error (status=${status}, stub=${stubStrs.join(',') || 'none'}) to ${remoteJid || 'peer'}`
            );
            e.code = 'WA_ACK_ERROR';
            e.waStatus = status;
            e.remoteJid = remoteJid;
            waiter.reject(e);
          } else if (status != null && status >= WAMessageStatus.SERVER_ACK) {
            // SERVER_ACK (2) / DELIVERY_ACK (3) / READ (4) — real acceptance
            waiter.resolve({ status, remoteJid });
          } else if (status === WAMessageStatus.PENDING) {
            // PENDING (1) — still in flight; keep waiting for SERVER_ACK or nack
          }
        }
      }
    });

    // You can add more: groups.update, presence.update, etc. as needed by group pulls / desk / warming

    return sock;
  }

  /**
   * Wait for delivery ack or 463 nack.
   * IMPORTANT: call this (register waiter) BEFORE sendMessage — WA often nacks within ~100ms.
   *
   * @param {string} msgId
   * @param {number} [timeoutMs]
   * @param {{ requirePositiveAck?: boolean }} [opts]
   *   requirePositiveAck (default true): timeout without SERVER_ACK+ rejects.
   *   If false, timeout resolves as timeout_ok (legacy blast/warming leniency).
   */
  _waitForSendAck(msgId, timeoutMs = 8000, opts = {}) {
    const requirePositiveAck = opts.requirePositiveAck !== false;
    if (!msgId) {
      if (requirePositiveAck) {
        const e = new Error('No WhatsApp message id — cannot confirm delivery');
        e.code = 'WA_NO_MSG_ID';
        return Promise.reject(e);
      }
      return Promise.resolve({ status: 'no_id' });
    }
    if (!this._sendAckWaiters) this._sendAckWaiters = new Map();

    // If a prior early nack was buffered, consume it
    if (this._earlyAckErrors?.has(msgId)) {
      const early = this._earlyAckErrors.get(msgId);
      this._earlyAckErrors.delete(msgId);
      return Promise.reject(early);
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this._sendAckWaiters.delete(msgId);
        if (requirePositiveAck) {
          const e = new Error(
            `No WhatsApp server ack within ${timeoutMs}ms — message not confirmed delivered. ` +
            `Do not treat as sent (possible reach-out lock or offline session).`
          );
          e.code = 'WA_ACK_TIMEOUT';
          reject(e);
        } else {
          // Legacy leniency for non-desk jobs that opt out
          resolve({ status: 'timeout_ok' });
        }
      }, timeoutMs);
      this._sendAckWaiters.set(msgId, {
        resolve: (v) => { clearTimeout(timer); this._sendAckWaiters.delete(msgId); resolve(v); },
        reject: (e) => { clearTimeout(timer); this._sendAckWaiters.delete(msgId); reject(e); },
      });
    });
  }

  /**
   * Resolve the best chat JID for sending.
   * Modern WA: if contact has a LID mapping, send to @lid or WA returns async error 463 on PN.
   * @see https://github.com/WhiskeySockets/Baileys/issues/2683
   */
  async _resolveSendJid(sock, accountId, to) {
    let jid = String(to || '').trim();
    if (!jid) throw new Error('send target required');

    let pnJid = null;
    let lidJid = null;

    if (jid.includes('@')) {
      if (jid.endsWith('@g.us') || jid.endsWith('@broadcast')) return jid;
      if (jid.endsWith('@lid')) {
        lidJid = jid;
      } else if (jid.endsWith('@s.whatsapp.net') || jid.endsWith('@c.us')) {
        const [user, server] = jid.split('@');
        const digits = normalizeWaPhone(user, { throwOnInvalid: false, requireCountry: false });
        pnJid = `${digits}@${server}`;
      } else {
        return jid;
      }
    } else {
      const digits = normalizeWaPhone(jid, { throwOnInvalid: false, requireCountry: false });
      if (digits.length >= 15) lidJid = `${digits}@lid`;
      else pnJid = `${digits}@s.whatsapp.net`;
    }

    const phoneKey = (pnJid || lidJid || jid).replace(/@.*/, '').replace(/:\d+$/, '');

    // Fast path: conversation peer cache filled on inbound (mirrors receive path JID)
    try {
      const convo = await this.db('conversations')
        .where({ ws_account_id: accountId })
        .where(function () {
          this.where({ contact_phone: phoneKey });
          if (pnJid) this.orWhere({ peer_phone_jid: pnJid });
          if (lidJid) this.orWhere({ peer_remote_jid: lidJid });
        })
        .first();
      if (convo?.peer_remote_jid && String(convo.peer_remote_jid).endsWith('@lid')) {
        lidJid = convo.peer_remote_jid;
        logger.info(`[SEND] convo cache LID: ${lidJid}`);
      }
      if (convo?.peer_phone_jid && String(convo.peer_phone_jid).includes('@')) {
        pnJid = convo.peer_phone_jid;
      }
      // If cache already has a solid LID, skip heavy history / USync
      if (lidJid && convo?.peer_remote_jid === lidJid) {
        try {
          if (typeof sock.assertSessions === 'function') {
            await sock.assertSessions([lidJid], true);
          }
        } catch (e) {
          logger.warn(`[SEND] assertSessions(${lidJid}): ${e.message}`);
        }
        logger.info(`[SEND] using cached LID ${lidJid}${pnJid ? ` (PN ${pnJid})` : ''}`);
        return lidJid;
      }
    } catch (e) {
      // peer_* columns may be missing pre-migration
      logger.debug(`[SEND] convo cache lookup skipped: ${e.message}`);
    }

    // History: inbound chats use remoteJid=@lid + senderPn=@s.whatsapp.net
    try {
      const recent = await this.db('messages')
        .where({ ws_account_id: accountId, direction: 'in' })
        .where(function () {
          this.whereRaw(`raw->'peer'->>'phone' = ?`, [phoneKey])
            .orWhereRaw(`raw->'key'->>'senderPn' like ?`, [`${phoneKey}@%`])
            .orWhereRaw(`raw->'key'->>'remoteJid' like ?`, [`%${phoneKey}%`])
            .orWhereRaw(`raw->'peer'->>'jid' like ?`, [`%${phoneKey}%`]);
        })
        .orderBy('timestamp', 'desc')
        .first();

      const remote = recent?.raw?.key?.remoteJid;
      const senderPn = recent?.raw?.key?.senderPn || recent?.raw?.key?.remoteJidAlt;
      if (remote && String(remote).endsWith('@lid')) {
        lidJid = remote;
        logger.info(`[SEND] history LID for peer: ${lidJid}`);
      }
      if (senderPn && (String(senderPn).includes('@s.whatsapp.net') || String(senderPn).includes('@c.us'))) {
        pnJid = senderPn;
      }
    } catch (e) {
      logger.warn(`[SEND] peer jid lookup failed: ${e.message}`);
    }

    // Baileys internal LID map if present
    try {
      const pnUser = (pnJid || '').split('@')[0];
      const lidMap = sock?.signalRepository?.lidMapping;
      if (pnUser && lidMap?.getLIDForPN) {
        const mapped = await lidMap.getLIDForPN(pnUser);
        if (mapped) {
          lidJid = String(mapped).includes('@') ? mapped : `${mapped}@lid`;
          logger.info(`[SEND] lidMapping.getLIDForPN(${pnUser}) → ${lidJid}`);
        }
      }
    } catch (e) {
      logger.warn(`[SEND] lidMapping lookup failed: ${e.message}`);
    }

    // CRITICAL: prefer LID when known (avoids async 463 on PN-only send)
    if (lidJid) {
      jid = lidJid;
      logger.info(`[SEND] using LID ${lidJid}${pnJid ? ` (PN ${pnJid})` : ''}`);
    } else if (pnJid) {
      jid = pnJid;
      // onWhatsApp only for PN destinations
      try {
        if (typeof sock.onWhatsApp === 'function') {
          const digits = pnJid.split('@')[0];
          const results = await sock.onWhatsApp(digits);
          const hit = Array.isArray(results) ? results.find((r) => r?.exists) : null;
          if (hit?.jid) {
            jid = hit.jid;
            // If USync returned a lid-related field, prefer it
            if (hit.lid) {
              lidJid = String(hit.lid).includes('@') ? hit.lid : `${hit.lid}@lid`;
              jid = lidJid;
              logger.info(`[SEND] onWhatsApp → LID ${jid}`);
            } else {
              logger.info(`[SEND] onWhatsApp resolved ${digits} → ${jid}`);
            }
          }
        }
      } catch (e) {
        logger.warn(`[SEND] onWhatsApp failed: ${e.message}`);
      }
    }

    try {
      if (typeof sock.assertSessions === 'function') {
        await sock.assertSessions([jid], true);
      }
    } catch (e) {
      logger.warn(`[SEND] assertSessions(${jid}): ${e.message}`);
    }

    return jid;
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

    // Ensure keys is always a dict-of-dicts: { [type]: { [id]: value } }
    // Corrupted/legacy auth blobs sometimes store keys as null or an array.
    if (!state.keys || typeof state.keys !== 'object' || Array.isArray(state.keys)) {
      state.keys = {};
    }

    // Baileys mutates state.creds / fullState.creds in place, then emits creds.update.
    // Never replace the creds object reference — only persist.
    const saveCreds = async () => {
      await this._persistAuthState(account.id, state);
    };

    /**
     * SignalKeyStore interface expected by Baileys / makeCacheableSignalKeyStore:
     *   get(type, ids) → Promise<{ [id]: value }>   // NEVER undefined; omit missing ids
     *   set(data)      → Promise<void>              // data: { [type]: { [id]: value|null } }
     *
     * Returning undefined/array from get crashes auth-utils.js:
     *   fetched[id] → TypeError Cannot read properties of undefined
     */
    const keyStore = {
      get: async (type, ids) => {
        const out = {};
        const bucket = state.keys[type];
        if (!bucket || typeof bucket !== 'object') return out;
        for (const id of ids || []) {
          const value = bucket[id];
          if (value !== undefined && value !== null) {
            out[id] = value;
          }
        }
        return out;
      },
      set: async (data) => {
        for (const type in data) {
          state.keys[type] = state.keys[type] && typeof state.keys[type] === 'object'
            ? state.keys[type]
            : {};
          for (const id in data[type]) {
            const value = data[type][id];
            // null/undefined means delete (Baileys uses this for session cleanup)
            if (value === null || value === undefined) {
              delete state.keys[type][id];
            } else {
              state.keys[type][id] = value;
            }
          }
        }
        await this._persistAuthState(account.id, state);
      },
      clear: async () => {
        state.keys = {};
        await this._persistAuthState(account.id, state);
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

    // Best signal: Baileys emitted a QR ref → safe to call requestPairingCode
    if (update.qr) {
      clearTimeout(waiter.timeout);
      this._pairingReadyWaiters.delete(accountId);
      waiter.resolve('qr');
      return;
    }

    // Fallback: stay connected in connecting/open long enough (some builds skip QR emit)
    if (update.connection === 'open') {
      clearTimeout(waiter.timeout);
      this._pairingReadyWaiters.delete(accountId);
      waiter.resolve('open');
      return;
    }
    if (update.connection === 'connecting') {
      waiter.sawConnecting = true;
      // Defer resolve slightly so noise handshake can progress (not just nextTick placeholder)
      if (!waiter._connectingTimer) {
        waiter._connectingTimer = setTimeout(() => {
          const w = this._pairingReadyWaiters.get(accountId);
          if (!w) return;
          clearTimeout(w.timeout);
          this._pairingReadyWaiters.delete(accountId);
          w.resolve('connecting-settled');
        }, 2000);
      }
      return;
    }

    if (update.connection === 'close') {
      if (waiter._connectingTimer) clearTimeout(waiter._connectingTimer);
      const code = update.lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        clearTimeout(waiter.timeout);
        this._pairingReadyWaiters.delete(accountId);
        waiter.reject(new Error('Logged out before pairing could start'));
      }
    }
  }

  /**
   * Baileys docs: wait until QR (or connecting) before requestPairingCode.
   * Prefer real `qr` event — early `connecting` is only a nextTick placeholder.
   * Must be armed BEFORE the socket is created.
   */
  _armPairingReadyWait(accountId, timeoutMs = 60_000) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this._pairingReadyWaiters.delete(accountId);
        reject(new Error(
          'Timed out waiting for Baileys pairing phase (QR). Check network/proxy, then retry Link (Code).'
        ));
      }, timeoutMs);

      this._pairingReadyWaiters.set(accountId, {
        resolve,
        reject,
        timeout,
        preferQr: true,
        sawConnecting: false,
      });
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
      if (waiter._connectingTimer) clearTimeout(waiter._connectingTimer);
      this._pairingReadyWaiters.delete(accountId);
    }
    const rem = this._pairingReminders.get(accountId);
    if (rem) { clearInterval(rem); this._pairingReminders.delete(accountId); }

    this._clearHandshakeWait(accountId);
    this._handshakePhase.delete(accountId);

    const patch = { baileys_auth_state: null };
    // Gated path: controller already set linking; do not downgrade while handshake is in flight.
    if (!this._handshakeInFlight.has(accountId)) {
      patch.status = 'primary_registered';
    }
    await this.db('ws_accounts').where({ id: accountId }).update(patch);
  }

  _isHandshakePhaseActive(accountId) {
    const phase = this._handshakePhase.get(accountId);
    if (!phase) return false;
    return ['pending', 'accepted', 'accepted_weak', 'rejected', 'ambiguous'].includes(phase.status);
  }

  _effectiveHandshakeStatus(info) {
    return info.handshakeStatus ?? 'accepted';
  }

  _formatPairingReturn(existing) {
    if (this.handshakeGateEnabled) {
      const status = this._effectiveHandshakeStatus(existing);
      return {
        code: existing.code,
        handshakeStatus: status,
        handshakeWaitMs: existing.handshakeWaitMs ?? 0,
      };
    }
    return existing.code;
  }

  _logHandshake({ accountId, phone, event, statusCode, reason, handshakeWaitMs }) {
    logger.info('[PAIRING-HANDSHAKE]', {
      accountId,
      phone,
      event,
      statusCode,
      reason,
      handshakeWaitMs,
      gate: this.handshakeGateEnabled,
    });
  }

  async _rejectHandshakeWait(accountId, { handshakeStatus = 'rejected', reason, statusCode, message } = {}) {
    if (!this._handshakeWaiters.has(accountId)) return;

    const waiter = this._handshakeWaiters.get(accountId);
    const { phone, startedAt } = waiter;
    const handshakeWaitMs = Date.now() - startedAt;

    this._handshakePhase.set(accountId, {
      phone,
      status: handshakeStatus,
      startedAt,
      reason,
      statusCode,
      handshakeWaitMs,
    });
    this._clearHandshakeWait(accountId, { emitRejected: true });
    this._logHandshake({
      accountId,
      phone,
      event: handshakeStatus,
      statusCode,
      reason,
      handshakeWaitMs,
    });
    await this._revertLinkingStatus(accountId);
    await this._teardownFailedPairing(accountId, {
      reason: reason || handshakeStatus,
      skipStatusRevert: true,
      // post_pairing_qr is retryable; loggedOut-style rejects handled elsewhere as terminal
      suppressReconnect: handshakeStatus === 'rejected' && reason === 'loggedOut',
    });

    const error = new HandshakeRejectedError(handshakeStatus, {
      statusCode,
      reason,
      message,
    });
    waiter.reject(error);
  }

  /**
   * Stop the Baileys socket after a failed pairing handshake.
   * @param {object} opts
   * @param {boolean} [opts.suppressReconnect=false] — only true for *terminal* failures
   *   (loggedOut / exhausted retries). Do not suppress on ambiguous if caller will retry.
   */
  async _teardownFailedPairing(accountId, {
    reason,
    skipStatusRevert = false,
    suppressReconnect = false,
  } = {}) {
    if (this._teardownInFlight.has(accountId)) {
      logger.info(`[PAIRING] Teardown already in progress for ${accountId}, skip duplicate`, { reason });
      return;
    }
    this._teardownInFlight.add(accountId);
    try {
      if (suppressReconnect) this._suppressReconnect.add(accountId);
      this.pairingInProgress.delete(accountId);

      const rem = this._pairingReminders.get(accountId);
      if (rem) {
        clearInterval(rem);
        this._pairingReminders.delete(accountId);
      }

      const readyWaiter = this._pairingReadyWaiters.get(accountId);
      if (readyWaiter) {
        clearTimeout(readyWaiter.timeout);
        this._pairingReadyWaiters.delete(accountId);
      }

      const entry = activeSockets.get(accountId);
      if (entry?.sock) {
        try {
          entry.sock.end();
        } catch {
          /* ignore */
        }
      }
      activeSockets.delete(accountId);

      if (!skipStatusRevert) {
        await this._revertLinkingStatus(accountId).catch(() => {});
      }

      logger.info(`[PAIRING] Tore down socket after handshake failure for ${accountId}`, {
        reason: reason || 'unknown',
        suppressReconnect,
      });
    } finally {
      this._teardownInFlight.delete(accountId);
    }
  }

  _markCompanionHelloSent(accountId) {
    const waiter = this._handshakeWaiters.get(accountId);
    if (waiter) waiter.companionHelloSent = true;
  }

  _clearHandshakeWait(accountId, { emitRejected = false } = {}) {
    const waiter = this._handshakeWaiters.get(accountId);
    if (!waiter) return;

    clearTimeout(waiter.timeout);
    if (waiter.weakTimer) clearTimeout(waiter.weakTimer);
    this._handshakeWaiters.delete(accountId);

    if (emitRejected && this.handshakeGateEnabled) {
      const phase = this._handshakePhase.get(accountId);
      if (phase) {
        this.emit('pairing_handshake', {
          accountId,
          phone: phase.phone,
          status: phase.status,
          reason: phase.reason,
          statusCode: phase.statusCode,
        });
      }
    }
  }

  async _revertLinkingStatus(accountId) {
    await this.db('ws_accounts').where({ id: accountId }).update({
      status: 'primary_registered',
      updated_at: this.db.fn.now(),
    });
  }

  _armHandshakeWait(accountId, phone) {
    const startedAt = Date.now();
    this._handshakePhase.set(accountId, { phone, status: 'pending', startedAt });
    this._logHandshake({ accountId, phone, event: 'pending' });

    return new Promise((resolve, reject) => {
      let weakTimer = null;
      // Weak accept: socket still open after companion_hello.
      // Under gate we still allow this once companionHelloSent — phone often gets the
      // "pairing requested" push without a clean restartRequired within HANDSHAKE_WAIT_MS.
      // Full weak-without-hello remains debug-only (allowWeakWithGate).
      const weakAcceptEnabled = this.HANDSHAKE_WEAK_ACCEPT_MS > 0;
      if (weakAcceptEnabled) {
        weakTimer = setTimeout(() => {
          const entry = activeSockets.get(accountId);
          const waiter = this._handshakeWaiters.get(accountId);
          if (!entry?.sock?.ws?.isOpen || !waiter) return;

          // Socket can stay open in QR fallback mode without companion_hello acceptance.
          if (waiter.postPairingQrSeen) {
            logger.warn('[PAIRING-HANDSHAKE] Skipping weak accept — post-pairing QR already seen', {
              accountId,
              phone,
            });
            return;
          }

          // Require companion_hello unless allowWeakWithGate debug flag is on
          if (!waiter.companionHelloSent && !this.allowWeakWithGate) {
            logger.warn('[PAIRING-HANDSHAKE] Skipping weak accept — companion_hello not sent yet', {
              accountId,
              phone,
            });
            return;
          }

          logger.info(
            `[PAIRING-HANDSHAKE] Weak accept for ${phone} — ` +
            `${waiter.companionHelloSent ? 'companion_hello sent + socket open' : 'debug weak (no hello yet)'}; exposing code`
          );
          void this._resolveHandshakeWait(accountId, null, {
            status: 'accepted_weak',
            reason: waiter.companionHelloSent
              ? 'companion_hello_socket_open'
              : 'socket_open_at_weak_deadline',
          }).catch((err) => {
            logger.warn('[PAIRING-HANDSHAKE] weak accept resolve failed', {
              accountId,
              err: err.message,
            });
          });
        }, this.HANDSHAKE_WEAK_ACCEPT_MS);
      }

      const timeout = setTimeout(async () => {
        if (!this._handshakeWaiters.has(accountId)) return;
        const waiter = this._handshakeWaiters.get(accountId);
        this._clearHandshakeWait(accountId, { emitRejected: true });
        this._handshakePhase.set(accountId, {
          phone,
          status: 'ambiguous',
          startedAt: waiter.startedAt,
          reason: 'timeout',
        });
        const handshakeWaitMs = Date.now() - waiter.startedAt;
        this._logHandshake({
          accountId,
          phone,
          event: 'ambiguous',
          reason: 'timeout',
          handshakeWaitMs,
        });
        await this._revertLinkingStatus(accountId);
        // Soft teardown: allow outer multi-attempt loop to open a new socket
        await this._teardownFailedPairing(accountId, {
          reason: 'ambiguous_timeout',
          skipStatusRevert: true,
          suppressReconnect: false,
        });
        reject(
          new HandshakeRejectedError('ambiguous', {
            reason: 'timeout',
            message: `No decisive handshake signal within ${this.HANDSHAKE_WAIT_MS}ms`,
          })
        );
      }, this.HANDSHAKE_WAIT_MS);

      this._handshakeWaiters.set(accountId, {
        resolve,
        reject,
        timeout,
        weakTimer,
        startedAt,
        phone,
      });
    });
  }

  async _resolveHandshakeWait(accountId, update, forcedResult) {
    if (!this._handshakeWaiters.has(accountId)) return;

    const waiter = this._handshakeWaiters.get(accountId);
    const { phone, startedAt, resolve, reject } = waiter;

    let result = forcedResult;
    if (!result && update) {
      if (update.connection !== 'close') return;

      const statusCode = update.lastDisconnect?.error?.output?.statusCode;
      const reasonMsg = update.lastDisconnect?.error?.message || '';

      if (statusCode === DisconnectReason.restartRequired) {
        result = { status: 'accepted', reason: 'restartRequired', statusCode };
      } else if (reasonMsg.includes('Connection Failure')) {
        // Treat as retryable reject so multi-attempt companion_hello can try again.
        const error = new HandshakeRejectedError('rejected', {
          statusCode,
          reason: 'Connection Failure',
          message: `WhatsApp Connection Failure (statusCode=${statusCode || 'unknown'}) — companion_hello likely not registered; phone will not get a prompt`,
        });
        this._handshakePhase.set(accountId, {
          phone,
          status: 'rejected',
          reason: 'Connection Failure',
          statusCode,
          startedAt,
        });
        this._clearHandshakeWait(accountId, { emitRejected: true });
        this._logHandshake({
          accountId,
          phone,
          event: 'rejected',
          statusCode,
          reason: 'Connection Failure',
          handshakeWaitMs: Date.now() - startedAt,
        });
        await this._revertLinkingStatus(accountId);
        await this._teardownFailedPairing(accountId, {
          reason: 'Connection Failure',
          skipStatusRevert: true,
          suppressReconnect: false, // allow recovery reconnect / next hello attempt
        });
        reject(error);
        return;
      } else if (statusCode === DisconnectReason.loggedOut) {
        const error = new HandshakeRejectedError('rejected', {
          statusCode,
          reason: 'loggedOut',
        });
        this._handshakePhase.set(accountId, {
          phone,
          status: 'rejected',
          reason: 'loggedOut',
          statusCode,
          startedAt,
        });
        this._clearHandshakeWait(accountId, { emitRejected: true });
        this._logHandshake({
          accountId,
          phone,
          event: 'rejected',
          statusCode,
          reason: 'loggedOut',
          handshakeWaitMs: Date.now() - startedAt,
        });
        await this._revertLinkingStatus(accountId);
        await this._teardownFailedPairing(accountId, {
          reason: 'loggedOut',
          skipStatusRevert: true,
          suppressReconnect: true, // terminal
        });
        reject(error);
        return;
      } else {
        return;
      }
    }

    if (!result) return;

    if (['accepted', 'accepted_weak'].includes(result.status)) {
      const handshakeWaitMs = Date.now() - startedAt;
      this._clearHandshakeWait(accountId);
      this._handshakePhase.set(accountId, {
        phone,
        status: result.status,
        startedAt,
        handshakeWaitMs,
        reason: result.reason,
        statusCode: result.statusCode,
      });
      this._logHandshake({
        accountId,
        phone,
        event: result.status,
        statusCode: result.statusCode,
        reason: result.reason,
        handshakeWaitMs,
      });
      resolve({
        status: result.status,
        reason: result.reason,
        statusCode: result.statusCode,
        handshakeWaitMs,
        startedAt,
      });
    }
  }



  _getBackoff(accountId) {
    const current = this.reconnectDelays.get(accountId) || 1000;
    const next = Math.min(current * 1.8, 30000);
    this.reconnectDelays.set(accountId, next);
    return current;
  }

  /**
   * Publish QR challenge: cache + emit with PNG data URL (OpenWA-compatible for UI).
   */
  async _publishQr(account, qr) {
    // Never push QR for accounts already linked in DB unless operator started QR mode
    try {
      const row = await this.db('ws_accounts').where({ id: account.id }).select('status').first();
      if (row && ['linked', 'active'].includes(row.status) && !this.qrLinkInProgress.has(account.id)) {
        return;
      }
    } catch {}

    let qrDataUrl = null;
    try {
      qrDataUrl = await QRCode.toDataURL(qr);
    } catch (e) {
      logger.warn(`Failed to render QR PNG for ${account.phone}: ${e.message}`);
    }
    const payload = { qr, qrDataUrl, at: Date.now() };
    this.latestQr.set(account.id, payload);
    this.emit('qr', {
      accountId: account.id,
      phone: account.phone,
      qr,
      qrDataUrl,
    });
    logger.info(`QR generated for ${account.phone}`);
  }

  /**
   * Latest QR for GET /sessions/:id/qr polling.
   * @returns {{ qr: string, qrDataUrl: string|null, at: number, ageSeconds: number } | null}
   */
  getQRCode(accountId) {
    const entry = this.latestQr.get(accountId);
    if (!entry) return null;
    return {
      ...entry,
      ageSeconds: Math.floor((Date.now() - entry.at) / 1000),
    };
  }

  /**
   * Start QR scan link (non-blocking). Clears stale auth when forceNew so Baileys emits a fresh QR.
   * Phone is the primary — no primary_registered guard (unlike pairing).
   *
   * Safety: if saved auth exists, refuse unless forceNew:true so operators use reconnect instead of
   * creating a new multi-device link (which triggers WhatsApp restrictions).
   */
  async startQrLink(accountId, { forceNew = false, forceDirect = false } = {}) {
    let account = await this.db('ws_accounts').where({ id: accountId }).first();
    if (!account) throw new Error(`ws_account ${accountId} not found`);

    if (account.baileys_auth_state && !forceNew) {
      throw new Error(
        `Auth exists for ${account.phone} — use POST /sessions/${accountId}/reconnect to restore ` +
        `without re-linking. Pass forceNew:true only if WhatsApp removed this linked device.`
      );
    }

    if (forceDirect && account.proxy_id) {
      await this.db('ws_accounts').where({ id: accountId }).update({ proxy_id: null });
      account = await this.db('ws_accounts').where({ id: accountId }).first();
      logger.info(`[QR-LINK] forceDirect: cleared proxy for ${account.phone}`);
    }

    // Exclusive mode: drop pairing + stop any existing socket so we don't conflict/replaced
    this.pairingInProgress.delete(accountId);
    const rem = this._pairingReminders.get(accountId);
    if (rem) { clearInterval(rem); this._pairingReminders.delete(accountId); }
    this._clearReconnectTimer(accountId);
    this._stopReconnect.add(accountId);
    const old = activeSockets.get(accountId);
    if (old?.sock) {
      this._endSocketQuietly(old.sock);
      activeSockets.delete(accountId);
    }
    this._stopReconnect.delete(accountId);

    // Wipe only for first-time link (no auth) or explicit forceNew re-link
    if (forceNew || !account.baileys_auth_state) {
      await this._clearAuthForRelink(accountId, { status: 'linking' });
    } else {
      await this.db('ws_accounts').where({ id: accountId }).update({ status: 'linking' });
    }

    this.latestQr.delete(accountId);
    this.qrLinkInProgress.add(accountId);
    logger.info(`[QR-LINK] Starting QR link for ${account.phone} (forceNew=${!!forceNew})`);

    this.getOrCreateSocket(accountId).catch((e) => {
      logger.error(`[QR-LINK] Socket create failed for ${account.phone}: ${e.message}`);
      this.qrLinkInProgress.delete(accountId);
      this.emit('disconnected', {
        accountId,
        phone: account.phone,
        reason: e.message,
        shouldReconnect: false,
      });
    });

    return { accountId, phone: account.phone, status: 'scan_qr' };
  }

  /**
   * Wipe encrypted Baileys auth so the next connect emits a new QR / pairing challenge.
   * Unlike _resetPairingAuth, status is configurable (QR uses linking; pairing uses primary_registered).
   */
  async _clearAuthForRelink(accountId, { status = 'linking' } = {}) {
    const entry = activeSockets.get(accountId);
    if (entry?.sock) {
      try { entry.sock.end(); } catch {}
    }
    activeSockets.delete(accountId);
    this.latestQr.delete(accountId);

    await this.db('ws_accounts')
      .where({ id: accountId })
      .update({ baileys_auth_state: null, status });
  }

  /**
   * Public high-level API used by the rest of the system
   */
  async connectAccount(accountId) {
    return this.getOrCreateSocket(accountId);
  }

  /**
   * Whether a Baileys WebSocket is currently open for this account.
   */
  isSocketLive(accountId) {
    const entry = activeSockets.get(accountId);
    return !!(entry?.sock?.ws?.isOpen && !entry.dead);
  }

  /**
   * Safe reconnect: restore companion socket from saved baileys_auth_state.
   * Does NOT wipe auth, does NOT request pairing code / QR, does NOT logout.
   * Use this when the server process restarted or the socket dropped but the
   * multi-device link is still valid on WhatsApp.
   *
   * @returns {Promise<{ accountId: string, phone: string, status: 'live'|'connecting', reconnected: boolean }>}
   */
  async reconnectAccount(accountId) {
    const account = await this.db('ws_accounts').where({ id: accountId }).first();
    if (!account) throw new Error(`ws_account ${accountId} not found`);

    if (!account.baileys_auth_state) {
      const err = new Error(
        `No saved auth for ${account.phone}. Link once via QR or pairing code first ` +
        `(POST /sessions/connect). Do not spam re-link attempts.`
      );
      err.code = 'NO_AUTH';
      throw err;
    }

    // Idempotent: already live
    if (this.isSocketLive(accountId)) {
      logger.info(`[RECONNECT] ${account.phone} already live — no-op`);
      return {
        accountId,
        phone: account.phone,
        status: 'live',
        reconnected: false,
      };
    }

    // Ensure we are not stuck in intentional-stop or pairing/QR mode
    this._stopReconnect.delete(accountId);
    this._clearReconnectTimer(accountId);
    this.pairingInProgress.delete(accountId);
    this.qrLinkInProgress.delete(accountId);
    this.latestQr.delete(accountId);
    const rem = this._pairingReminders.get(accountId);
    if (rem) {
      clearInterval(rem);
      this._pairingReminders.delete(accountId);
    }

    // Drop dead map entry so getOrCreateSocket builds a fresh socket with saved auth
    const existing = activeSockets.get(accountId);
    if (existing && (!existing.sock?.ws?.isOpen || existing.dead)) {
      this._endSocketQuietly(existing.sock);
      activeSockets.delete(accountId);
    }

    logger.info(`[RECONNECT] Restoring session for ${account.phone} from saved auth (no re-link)`);
    this._sessionFailCounts.set(accountId, 0);

    // Keep warehouse labels; connection.open will set linked when WA accepts
    if (['offline', 'error'].includes(account.status)) {
      await this.db('ws_accounts')
        .where({ id: accountId })
        .update({ status: 'linked', updated_at: this.db.fn.now() })
        .catch(() => {});
    }

    try {
      const sock = await this.getOrCreateSocket(accountId, { waitOpen: true, openTimeoutMs: 60000 });
      const live = !!(sock?.ws?.isOpen);
      return {
        accountId,
        phone: account.phone,
        status: live ? 'live' : 'connecting',
        reconnected: true,
      };
    } catch (e) {
      logger.warn(`[RECONNECT] ${account.phone} open wait: ${e.message}`);
      return {
        accountId,
        phone: account.phone,
        status: 'connecting',
        reconnected: true,
        error: e.message,
      };
    }
  }

  /**
   * Request a pairing code for phone number association login (supports phone primary or cloud emulator primary).
   * Instead of showing a QR to scan, this returns an 8-digit code that you enter
   * directly in the WhatsApp app (running on your phone as primary, or in cloud emulator).
   * This enables more automated / phone-less registration flows.
   *
   * Safety: if saved auth exists, refuse unless forceNew:true — use reconnectAccount instead.
   * When PAIRING_HANDSHAKE_GATE=1, code is only returned after handshake accept (or weak accept).
   */
  async requestPairingCode(accountId, phoneNumber, { forceNew = false, forceDirect = false } = {}) {
    let account = await this.db('ws_accounts').where({ id: accountId }).first();
    if (!account) throw new Error(`ws_account ${accountId} not found`);

    const rawPhone = phoneNumber || account.phone || '';
    const phoneDigits = normalizeWaPhone(rawPhone);
    phoneNumber = phoneDigits;

    // Prefer safe reconnect over creating a brand-new multi-device companion
    if (account.baileys_auth_state && !forceNew) {
      throw new Error(
        `Auth exists for ${account.phone} — use POST /sessions/${accountId}/reconnect to restore ` +
        `without re-linking. Pass forceNew:true only if WhatsApp removed this linked device and you must pair again.`
      );
    }

    // Exclusive mode: leave QR path
    this.qrLinkInProgress.delete(accountId);
    this.latestQr.delete(accountId);
    this._clearReconnectTimer(accountId);

    const existing = this.pairingInProgress.get(accountId);
    if (!forceNew && existing && Date.now() - existing.startedAt < PAIRING_CODE_TTL_MS) {
      const status = this._effectiveHandshakeStatus(existing);
      if (['accepted', 'accepted_weak'].includes(status) && !existing.rejectedReason && existing.code) {
        logger.info(`Reusing in-flight pairing code for ${phoneNumber}: ${existing.code}`);
        return this._formatPairingReturn(existing);
      }
    }

    if (!this.handshakeGateEnabled) {
      await this._resetPairingAuth(accountId);
      // re-mark pairing mode for MACOS patch after reset
      this.pairingInProgress.set(accountId, {
        phone: phoneNumber,
        code: null,
        startedAt: Date.now(),
        reconnectAttempts: 0,
      });
      const code = await this._requestPairingCodeCore(accountId, phoneNumber, { forceDirect });
      return this._finalizePairingCodeExposure(accountId, phoneNumber, code);
    }

    if (this._handshakeInFlight.has(accountId)) {
      throw new InFlightHandshakeError(
        accountId,
        'Handshake already in progress for this account'
      );
    }

    let resolveInflight;
    let rejectInflight;
    const inflightPromise = new Promise((res, rej) => {
      resolveInflight = res;
      rejectInflight = rej;
    });
    this._handshakeInFlight.set(accountId, inflightPromise);

    const maxAttempts = this.pairingHelloAttempts;
    let lastErr;

    try {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          // Fresh noise keys every attempt — required for a new companion_hello registration
          await this._resetPairingAuth(accountId);
          // Clear suppress flag from any prior soft teardown
          this._suppressReconnect.delete(accountId);

          const { sock } = await this._preparePairingSocketForCode(accountId, phoneNumber, {
            forceDirect: forceDirect && attempt === 1,
          });

          this.emit('pairing_handshake', {
            accountId,
            phone: phoneNumber,
            status: 'pending',
            attempt,
            maxAttempts,
          });
          const handshakePromise = this._armHandshakeWait(accountId, phoneNumber);

          const code = await this._requestPairingCodeFromSocket(sock, phoneNumber, accountId);

          // Register provisional pairing state so close-handler treats this as "awaiting pairing"
          this.pairingInProgress.set(accountId, {
            phone: phoneNumber,
            code,
            startedAt: Date.now(),
            handshakeStatus: 'pending',
            reconnectAttempts: 0,
            helloAttempt: attempt,
          });
          logger.info(
            `[PAIRING] companion_hello attempt ${attempt}/${maxAttempts} for ${phoneNumber} — ` +
            `watch phone for notification NOW (code held until handshake accept)`
          );

          const handshakeResult = await handshakePromise;
          const result = this._finalizePairingCodeExposure(accountId, phoneNumber, code, handshakeResult);
          resolveInflight(result);
          return result;
        } catch (err) {
          lastErr = err;
          this._clearHandshakeWait(accountId);
          const retryable = err instanceof HandshakeRejectedError
            && (err.reason === 'timeout' || err.reason === 'Connection Failure' || err.handshakeStatus === 'ambiguous');

          if (retryable && attempt < maxAttempts) {
            logger.warn(
              `[PAIRING] Hello attempt ${attempt}/${maxAttempts} failed for ${phoneNumber}: ` +
              `${err.reason || err.handshakeStatus || err.message} — retrying companion_hello`
            );
            await this._teardownFailedPairing(accountId, {
              reason: `retry_after_${err.reason || err.handshakeStatus}`,
              skipStatusRevert: true,
              suppressReconnect: false,
            }).catch(() => {});
            await new Promise((r) => setTimeout(r, 1500 * attempt));
            continue;
          }
          throw err;
        }
      }
      throw lastErr || new Error('Pairing failed with no attempts');
    } catch (err) {
      rejectInflight(err);
      if (err instanceof HandshakeRejectedError || err?.status === 422) {
        await this._teardownFailedPairing(accountId, {
          reason: err.handshakeStatus || err.message,
          skipStatusRevert: true,
          suppressReconnect: true,
        }).catch(() => {});
      }
      throw err;
    } finally {
      this._handshakeInFlight.delete(accountId);
    }
  }

  async _requestPairingCodeCore(accountId, phoneNumber, { forceDirect = false } = {}) {
    const { sock } = await this._preparePairingSocketForCode(accountId, phoneNumber, { forceDirect });
    return this._requestPairingCodeFromSocket(sock, phoneNumber);
  }

  async _preparePairingSocketForCode(accountId, phoneNumber, { forceDirect = false } = {}) {
    let account = await this.db('ws_accounts').where({ id: accountId }).first();
    if (forceDirect && account.proxy_id) {
      await this.db('ws_accounts').where({ id: accountId }).update({ proxy_id: null });
      account = await this.db('ws_accounts').where({ id: accountId }).first();
      logger.info(`[PAIRING-TEST] forceDirect: cleared proxy for this attempt on ${phoneNumber}`);
    }

    const isTestNoPhone = account.phone === '+13185167435' || account.phone === '13185167435';
    if (!isTestNoPhone && !['primary_registered', 'linking', 'linked', 'offline', 'error'].includes(account.status)) {
      throw new Error(
        `Cannot request pairing: ${account.phone} is not primary_registered (status=${account.status}). ` +
        `If using phone as primary: register in WhatsApp on phone then mark-registered. If emulator primary: complete registration first.`
      );
    }

    // CRITICAL: mark pairing mode BEFORE socket create so MACOS patch + Chrome browser apply
    this.pairingInProgress.set(accountId, {
      phone: phoneNumber,
      code: null,
      startedAt: Date.now(),
      reconnectAttempts: 0,
    });
    await this.db('ws_accounts').where({ id: accountId }).update({ status: 'linking' });

    logger.info(`[PAIRING] FRESH requestPairingCode for ${phoneNumber} — proxy=${account?.proxy_id || 'none'}`);
    if (account?.proxy_id) {
      logger.info(`[PAIRING] Proxy ID ${account.proxy_id} will be used for this Baileys connection`);
    }

    const pairingReady = this._armPairingReadyWait(accountId, 45_000);
    const sock = await this.getOrCreateSocket(accountId);
    logger.info(`[PAIRING] Socket created for ${phoneNumber}, awaiting ready...`);

    // Residential proxies + WA websocket can take well over 30s on a cold tunnel
    const SOCKET_READY_TIMEOUT_MS = parseInt(process.env.SOCKET_READY_TIMEOUT_MS || '60000', 10);
    const timeoutErr = new Error(
      `Timed out waiting for socket ready after ${SOCKET_READY_TIMEOUT_MS}ms. ` +
      `Check if proxy allows web.whatsapp.com. Test forceDirect:true.`
    );

    try {
      const readyHow = await Promise.race([
        pairingReady,
        new Promise((_, rej) => setTimeout(() => rej(timeoutErr), SOCKET_READY_TIMEOUT_MS)),
      ]);
      logger.info(`[PAIRING] Ready signal for ${phoneNumber}: ${readyHow}`);
    } catch (e) {
      if (e === timeoutErr) throw e;
      logger.warn(`Pairing ready wait issue for ${phoneNumber}: ${e.message} — proceeding`);
    }

    logger.info(`[PAIRING] Ready event, awaiting socket open...`);
    try {
      if (sock.waitForSocketOpen) {
        await Promise.race([
          sock.waitForSocketOpen(),
          new Promise((_, rej) => setTimeout(() => rej(timeoutErr), Math.min(SOCKET_READY_TIMEOUT_MS, 15000))),
        ]);
      }
      logger.info(`[PAIRING] Socket open succeeded for ${phoneNumber}`);
    } catch (e) {
      if (e === timeoutErr) throw e;
      const proxyHint = account.proxy_id
        ? ` (proxy ${account.proxy_id} — try forceDirect:true or a different proxy)`
        : ' (direct connection)';
      logger.error(`[PAIRING] Socket failed to open for ${phoneNumber}${proxyHint}: ${e.message}`);
      throw new Error(`Socket failed before pairing code could be requested: ${e.message}${proxyHint}`);
    }

    // Brief settle so companion_hello is not sent on a half-open stream
    await new Promise((r) => setTimeout(r, 800));

    return { sock, account };
  }

  async _requestPairingCodeFromSocket(sock, phoneNumber, accountId = null) {
    const phoneDigits = String(phoneNumber).replace(/[^0-9]/g, '');
    logger.info(`[PAIRING] Calling sock.requestPairingCode("${phoneDigits}")…`);
    let code;
    try {
      if (accountId) this._markCompanionHelloSent(accountId);
      const codeTimeout = new Error(
        'requestPairingCode timed out after 25s — socket may be open but WA not responding (proxy interference?)'
      );
      code = await Promise.race([
        sock.requestPairingCode(phoneDigits),
        new Promise((_, rej) => setTimeout(() => rej(codeTimeout), 25000)),
      ]);
    } catch (e) {
      if (e.message && e.message.includes('proxy rejected')) {
        throw new Error('The SOCKS5 proxy rejected the connection to WhatsApp. Try forceDirect:true or a different proxy.');
      }
      throw e;
    }

    // Normalize display code
    code = String(code || '').replace(/\s+/g, '').toUpperCase();
    if (code.length !== 8) {
      logger.warn(`[PAIRING] Unexpected code length ${code.length}: ${code}`);
    }

    logger.info(
      `[PAIRING] client-side code generated + companion_hello IQ sent for ${phoneNumber}.`
    );

    return code;
  }

  _finalizePairingCodeExposure(accountId, phoneNumber, code, handshakeResult = null) {
    const pairingInfo = {
      phone: phoneNumber,
      code,
      startedAt: Date.now(),
      reconnectAttempts: 0,
    };

    if (handshakeResult) {
      pairingInfo.handshakeStatus = handshakeResult.status;
      pairingInfo.handshakeResolvedAt = Date.now();
      pairingInfo.handshakeWaitMs = handshakeResult.handshakeWaitMs;
    }

    this.pairingInProgress.set(accountId, pairingInfo);
    this._handshakePhase.delete(accountId);

    if (handshakeResult) {
      this.emit('pairing_handshake', {
        accountId,
        phone: phoneNumber,
        status: handshakeResult.status,
        handshakeWaitMs: handshakeResult.handshakeWaitMs,
      });
    }

    this.emit('pairing_code', { accountId, phone: phoneNumber, code });
    this._showPairingCodeBanner(phoneNumber, code);
    this._startPairingReminder(accountId, phoneNumber, code);

    if (this.handshakeGateEnabled && handshakeResult) {
      return {
        code,
        handshakeStatus: handshakeResult.status,
        handshakeWaitMs: handshakeResult.handshakeWaitMs,
      };
    }

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
    this._stopReconnect.add(accountId);
    this._clearReconnectTimer(accountId);
    this._connectingLocks.delete(accountId);
    this.latestQr.delete(accountId);
    this.qrLinkInProgress.delete(accountId);
    this.pairingInProgress.delete(accountId);
    this._lastConnectedEmit.delete(accountId);

    const entry = activeSockets.get(accountId);
    if (entry?.sock) {
      if (permanent) {
        try { await entry.sock.logout(); } catch {}
      }
      this._endSocketQuietly(entry.sock);
    }
    activeSockets.delete(accountId);

    if (permanent) {
      await this.db('ws_accounts').where({ id: accountId }).update({ status: 'offline', baileys_auth_state: null });
    }
  }

  /**
   * Warm the chat path before relay: presence + trusted-contact privacy tokens.
   * Reduces false "reach-out" (463) when WA thinks this is a cold unknown peer.
   */
  async _prepSendPresence(sock, jid) {
    if (!sock || !jid || jid.endsWith('@g.us') || jid.endsWith('@broadcast')) return;
    try {
      if (typeof sock.presenceSubscribe === 'function') {
        await sock.presenceSubscribe(jid).catch(() => {});
      }
      if (typeof sock.sendPresenceUpdate === 'function') {
        await sock.sendPresenceUpdate('composing', jid).catch(() => {});
        await new Promise((r) => setTimeout(r, 250 + Math.random() * 350));
        await sock.sendPresenceUpdate('paused', jid).catch(() => {});
      }
    } catch (e) {
      logger.debug(`[SEND] presence prep skipped: ${e.message}`);
    }
    try {
      if (typeof sock.getPrivacyTokens === 'function') {
        await sock.getPrivacyTokens([jid]).catch(() => {});
      }
    } catch (_) { /* optional */ }
  }

  async sendText(accountId, to, text, options = {}) {
    // Require a fully open socket — half-dead entries caused Connection Closed / 1006
    let sock;
    if (this.isSocketLive(accountId)) {
      sock = activeSockets.get(accountId).sock;
    } else {
      logger.info(`[SEND] Session not live for ${accountId} — reconnecting before send`);
      try {
        await this.reconnectAccount(accountId);
      } catch (e) {
        if (e.code === 'NO_AUTH') throw e;
      }
      sock = await this.getOrCreateSocket(accountId, {
        waitOpen: true,
        openTimeoutMs: options.openTimeoutMs || 45000,
      });
    }
    if (!sock?.ws?.isOpen) {
      throw new Error('WhatsApp session is offline — use Reconnect, then try again');
    }

    const jid = await this._resolveSendJid(sock, accountId, to);
    if (options.delayMs) await new Promise((r) => setTimeout(r, options.delayMs));

    // Desk / default: require real SERVER_ACK. Workers may set requirePositiveAck:false.
    const waitAck = options.waitAck !== false;
    const requirePositiveAck = options.requirePositiveAck !== false;
    const ackTimeoutMs = options.ackTimeoutMs || (requirePositiveAck ? 8000 : 3500);
    const prepPresence = options.prepPresence !== false;

    const doSend = async (s, destJid, { allowLidRetry = true } = {}) => {
      if (prepPresence) await this._prepSendPresence(s, destJid);

      // Pre-generate id + register waiter BEFORE relay — 463 often lands in ~100ms
      const msgId = generateMessageIDV2(s.user?.id);
      if (this._msgCache?.get(accountId)) {
        this._msgCache.get(accountId).set(msgId, { conversation: text });
      }

      let ackPromise = null;
      if (waitAck) {
        ackPromise = this._waitForSendAck(msgId, ackTimeoutMs, { requirePositiveAck });
      }

      const t0 = Date.now();
      let result;
      try {
        result = await s.sendMessage(destJid, { text }, { messageId: msgId });
      } catch (sendErr) {
        // Cancel waiter if relay itself threw (avoid unhandled rejection on ackPromise)
        if (ackPromise) ackPromise.catch(() => {});
        if (this._sendAckWaiters?.has(msgId)) {
          const w = this._sendAckWaiters.get(msgId);
          try { w.reject(sendErr); } catch { /* already settled */ }
        }
        throw sendErr;
      }

      const usedId = result?.key?.id || msgId;
      if (usedId && this._msgCache?.get(accountId)) {
        this._msgCache.get(accountId).set(usedId, { conversation: text });
      }
      logger.info(`[SEND] queued to WA`, {
        accountId,
        to: destJid,
        id: usedId,
        relayMs: Date.now() - t0,
      });

      if (ackPromise) {
        try {
          // If Baileys rewrote the id (should not with messageId option), re-bind waiter
          if (usedId !== msgId && this._sendAckWaiters?.has(msgId)) {
            const w = this._sendAckWaiters.get(msgId);
            this._sendAckWaiters.delete(msgId);
            this._sendAckWaiters.set(usedId, w);
          }
          const ack = await ackPromise;
          logger.info(`[SEND] ack`, { id: usedId, ack, totalMs: Date.now() - t0 });
          result = result || {};
          result.ack = ack;
          result.deliveryStatus = ack?.status >= WAMessageStatus.DELIVERY_ACK
            ? 'delivered'
            : ack?.status >= WAMessageStatus.SERVER_ACK
              ? 'server_ack'
              : 'queued';
        } catch (ackErr) {
          // If we sent to PN and got 463, one retry via LID if history has it
          if (
            allowLidRetry &&
            (ackErr.code === 'WA_ACK_463' || /463/.test(ackErr.message)) &&
            destJid.endsWith('@s.whatsapp.net')
          ) {
            const phoneKey = destJid.split('@')[0];
            let lid = null;
            try {
              const convo = await this.db('conversations')
                .where({ ws_account_id: accountId })
                .where(function () {
                  this.where({ contact_phone: phoneKey })
                    .orWhere({ peer_phone_jid: `${phoneKey}@s.whatsapp.net` });
                })
                .first();
              if (convo?.peer_remote_jid && String(convo.peer_remote_jid).endsWith('@lid')) {
                lid = convo.peer_remote_jid;
              }
            } catch (_) { /* columns may not exist yet before migrate */ }
            if (!lid) {
              const recent = await this.db('messages')
                .where({ ws_account_id: accountId, direction: 'in' })
                .whereRaw(`raw->'key'->>'senderPn' like ?`, [`${phoneKey}@%`])
                .orderBy('timestamp', 'desc')
                .first()
                .catch(() => null);
              if (recent?.raw?.key?.remoteJid && String(recent.raw.key.remoteJid).endsWith('@lid')) {
                lid = recent.raw.key.remoteJid;
              }
            }
            if (lid) {
              logger.warn(`[SEND] 463 on PN — retrying once via LID ${lid}`);
              return doSend(s, lid, { allowLidRetry: false });
            }
          }
          throw ackErr;
        }
      } else {
        result.deliveryStatus = 'queued';
      }
      return result;
    };

    try {
      return await doSend(sock, jid);
    } catch (e) {
      const msg = e?.message || String(e);
      const code = e?.code || '';
      // Do not reconnect-retry on WA policy nacks
      if (code === 'WA_ACK_463' || code === 'WA_ACK_ERROR' || /463/.test(msg)) throw e;
      if (/closed|1006|Connection Closed/i.test(msg) && !/ack/i.test(msg)) {
        logger.warn(`[SEND] Retry once after ${msg} for ${accountId}`);
        const entry = activeSockets.get(accountId);
        if (entry) {
          entry.dead = true;
          this._endSocketQuietly(entry.sock);
          activeSockets.delete(accountId);
        }
        sock = await this.getOrCreateSocket(accountId, { waitOpen: true, openTimeoutMs: 45000 });
        const jid2 = await this._resolveSendJid(sock, accountId, to);
        return doSend(sock, jid2);
      }
      throw e;
    }
  }

  /**
   * Fetch contact profile picture URL (Baileys). May fail if privacy blocks.
   * @returns {Promise<string|null>} temporary HTTPS URL
   */
  async getProfilePictureUrl(accountId, phoneOrJid, type = 'preview') {
    const sock = await this.getOrCreateSocket(accountId);
    let jid = String(phoneOrJid || '').trim();
    if (!jid.includes('@')) {
      const digits = normalizeWaPhone(jid, { throwOnInvalid: false, requireCountry: false });
      jid = `${digits}@s.whatsapp.net`;
    }
    try {
      const url = await sock.profilePictureUrl(jid, type);
      return url || null;
    } catch (e) {
      logger.info(`No profile picture for ${jid}: ${e.message}`);
      return null;
    }
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
  getPairingDiagnostics() {
    const diagnostics = {
      handshakeGateEnabled: this.handshakeGateEnabled,
      handshakeWaitMs: this.HANDSHAKE_WAIT_MS,
      handshakeWeakAcceptMs: this.HANDSHAKE_WEAK_ACCEPT_MS,
      activeSockets: [],
      pairingInProgress: [],
      handshakePhase: [],
    };

    for (const [accountId, entry] of activeSockets.entries()) {
      diagnostics.activeSockets.push({
        accountId,
        phone: entry.account?.phone,
        wsOpen: !!entry.sock?.ws?.isOpen,
        proxyId: entry.proxy?.id || entry.account?.proxy_id || null,
      });
    }

    for (const [accountId, info] of this.pairingInProgress.entries()) {
      diagnostics.pairingInProgress.push({
        accountId,
        phone: info.phone,
        code: info.code,
        handshakeStatus: this._effectiveHandshakeStatus(info),
        handshakeWaitMs: info.handshakeWaitMs ?? 0,
        ageSeconds: Math.floor((Date.now() - info.startedAt) / 1000),
        reconnectAttempts: info.reconnectAttempts || 0,
      });
    }

    for (const [accountId, phase] of this._handshakePhase.entries()) {
      const waiter = this._handshakeWaiters.get(accountId);
      diagnostics.handshakePhase.push({
        accountId,
        phone: phase.phone,
        status: phase.status,
        reason: phase.reason,
        statusCode: phase.statusCode,
        handshakeWaitMs: phase.handshakeWaitMs,
        companionHelloSent: !!waiter?.companionHelloSent,
        postPairingQrSeen: !!waiter?.postPairingQrSeen,
      });
    }

    return diagnostics;
  }

  getPairingCodes({ includePending = false } = {}) {
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
  /**
   * Soft shutdown: end websockets only — NEVER logout.
   * Keeps multi-device link alive on the phone; sessions restore after process restart.
   */
  async shutdownAll() {
    for (const id of [...activeSockets.keys()]) {
      this._stopReconnect.add(id);
      this._clearReconnectTimer(id);
    }
    for (const [, entry] of activeSockets) {
      // end() only — do not call logout()
      this._endSocketQuietly(entry.sock);
    }
    activeSockets.clear();
    this._connectingLocks.clear();
    for (const iv of this._pairingReminders.values()) clearInterval(iv);
    this._pairingReminders.clear();
    // Preserve linked status in DB for accounts that still have auth state
    try {
      await this.db('ws_accounts')
        .whereNotNull('baileys_auth_state')
        .whereIn('status', ['offline', 'error', 'linking'])
        .update({ status: 'linked', updated_at: this.db.fn.now() });
    } catch (_) { /* ignore */ }
  }
}

export default SessionManager;
