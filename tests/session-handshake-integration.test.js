/**
 * Integration harness: exercises connection.update handler logic wired the same way
 * as SessionManager._createSocketForAccount, driven through gated requestPairingCode
 * (PAIRING_HANDSHAKE_GATE=1).
 */
import { describe, test, before } from 'node:test';
import assert from 'node:assert/strict';
import { DisconnectReason } from '@whiskeysockets/baileys';
import {
  restartRequiredClose,
  connectionFailureClose,
  connectingUpdate,
} from './fixtures/connection-updates.js';

process.env.NODE_ENV = 'test';
process.env.PAIRING_HANDSHAKE_GATE = '1';
process.env.DB_NAME = 'wa_control_test';
process.env.DB_USER = 'test';
process.env.DB_PASSWORD = 'testpassword32charsminimumhere!!';
process.env.JWT_SECRET = 'test-jwt-secret-minimum-32-characters!!';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars-min!!';

/** Per-test handshake signal fired after requestPairingCode returns. */
let handshakeUpdateAfterCode = null;

/** Latest mock socket (for manual emit in tests). */
let latestMockSocket = null;

function createMockBaileysSocket() {
  const handlers = new Map();

  const sock = {
    ev: {
      on(event, handler) {
        if (!handlers.has(event)) handlers.set(event, []);
        handlers.get(event).push(handler);
      },
    },
    async fireConnectionUpdate(update) {
      for (const handler of handlers.get('connection.update') || []) {
        await handler(update);
      }
    },
    requestPairingCode: async () => {
      if (handshakeUpdateAfterCode) {
        await sock.fireConnectionUpdate(handshakeUpdateAfterCode);
      }
      return 'ABCD1234';
    },
    waitForSocketOpen: async () => {},
    waitForConnectionUpdate: async () => {},
    end() {
      sock.ws.isOpen = false;
    },
    ws: { isOpen: true },
    user: { name: 'Integration Primary' },
  };

  latestMockSocket = sock;
  return sock;
}

/**
 * Mirrors the production sock.ev.on('connection.update') handler registered in
 * SessionManager._createSocketForAccount (reconnect timers omitted for determinism).
 */
function wireConnectionUpdateHandler(mgr, account, sock) {
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      mgr.emit('qr', { accountId: account.id, phone: account.phone, qr });
    }

    mgr._resolvePairingReady(account.id, update);
    await mgr._resolveHandshakeWait(account.id, update);

    if (connection === 'open') {
      const updatePatch = {
        status: 'linked',
        last_linked_at: mgr.db.fn.now(),
        last_seen_at: mgr.db.fn.now(),
      };

      if (account.display_name == null) {
        const user = sock.user || {};
        if (user.name || user.verifiedName) {
          updatePatch.display_name = user.name || user.verifiedName;
        }
      }

      await mgr.db('ws_accounts').where({ id: account.id }).update(updatePatch);
      mgr.pairingInProgress.delete(account.id);
      mgr.emit('connected', { accountId: account.id, phone: account.phone });
      mgr.reconnectDelays.delete(account.id);
    }

    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      const reason = lastDisconnect?.error?.message || 'unknown';
      const awaitingPairing = mgr.pairingInProgress.has(account.id);
      const handshakePhaseActive = mgr._isHandshakePhaseActive(account.id);

      if (!awaitingPairing && !handshakePhaseActive) {
        await mgr.db('ws_accounts')
          .where({ id: account.id })
          .update({ status: shouldReconnect ? 'offline' : 'error' });
      }

      mgr.emit('disconnected', {
        accountId: account.id,
        phone: account.phone,
        reason,
        shouldReconnect,
      });

      activeSockets.delete(account.id);
    }
  });
}

function createMockDb(initialStatus = 'linking') {
  let status = initialStatus;
  const updates = [];

  const db = (table) => ({
    where: (cond) => ({
      first: async () => {
        if (table === 'ws_accounts') {
          return {
            id: cond.id || 'acc-int-1',
            phone: '+15559876543',
            status,
            proxy_id: null,
            baileys_auth_state: null,
            display_name: null,
            port_id: null,
            acquisition_method: 'phone_assoc',
          };
        }
        if (table === 'proxies') return null;
        if (table === 'ports') return null;
        return null;
      },
      update: async (patch) => {
        updates.push({ table, cond, patch });
        if (patch.status !== undefined) status = patch.status;
        return 1;
      },
      select: () => ({
        first: async () => null,
      }),
    }),
    whereRaw: () => ({
      orderBy: () => ({
        first: async () => null,
      }),
    }),
  });

  db.fn = { now: () => new Date() };
  db._updates = updates;
  db._getStatus = () => status;
  db._setStatus = (s) => {
    status = s;
  };

  return db;
}

let SessionManager;
let activeSockets;
let HandshakeRejectedError;

before(async () => {
  ({ SessionManager, activeSockets } = await import('../src/core/sessions/SessionManager.js'));
  ({ HandshakeRejectedError } = await import('../src/core/sessions/errors.js'));
});

function createIntegrationManager(db) {
  const mgr = new SessionManager(db);
  assert.equal(mgr.handshakeGateEnabled, true);
  mgr.HANDSHAKE_WEAK_ACCEPT_MS = 80;
  mgr.HANDSHAKE_WAIT_MS = 200;

  mgr._showPairingCodeBanner = () => {};
  mgr._startPairingReminder = () => {};

  // requestPairingCode rejects inflightPromise and throws; absorb the duplicate rejection.
  const origInflightSet = mgr._handshakeInFlight.set.bind(mgr._handshakeInFlight);
  mgr._handshakeInFlight.set = (key, promise) => {
    promise.catch(() => {});
    return origInflightSet(key, promise);
  };

  mgr.getOrCreateSocket = async function getOrCreateSocketForIntegration(accountId) {
    if (activeSockets.has(accountId)) {
      return activeSockets.get(accountId).sock;
    }

    const account = await this.db('ws_accounts').where({ id: accountId }).first();
    const sock = createMockBaileysSocket();
    wireConnectionUpdateHandler(this, account, sock);
    activeSockets.set(accountId, { sock, account, proxy: null });
    queueMicrotask(() => sock.fireConnectionUpdate(connectingUpdate()));
    return sock;
  };

  mgr._preparePairingSocketForCode = async function prepareForIntegration(accountId) {
    this._armPairingReadyWait(accountId);
    const sock = await this.getOrCreateSocket(accountId);
    await this._resolvePairingReady(accountId, connectingUpdate());
    const account = await this.db('ws_accounts').where({ id: accountId }).first();
    return { sock, account };
  };

  return mgr;
}

function cleanupManager(mgr, accountId) {
  mgr._clearHandshakeWait(accountId);
  mgr._handshakePhase.delete(accountId);
  mgr._handshakeInFlight.delete(accountId);
  mgr.pairingInProgress.delete(accountId);
  const rem = mgr._pairingReminders?.get(accountId);
  if (rem) {
    clearInterval(rem);
    mgr._pairingReminders.delete(accountId);
  }
  activeSockets.delete(accountId);
}

describe('SessionManager pairing integration (gate=1)', () => {
  before(() => {
    handshakeUpdateAfterCode = null;
    latestMockSocket = null;
  });

  test('accepted restartRequired through connection.update returns code after handshake', async () => {
    handshakeUpdateAfterCode = restartRequiredClose();
    const db = createMockDb('linking');
    const mgr = createIntegrationManager(db);
    const accountId = 'acc-accept-int';
    const events = [];

    mgr.on('pairing_handshake', (payload) => events.push(payload));
    mgr.on('pairing_code', (payload) => events.push({ type: 'pairing_code', ...payload }));

    const result = await mgr.requestPairingCode(accountId, '+15559876543');

    assert.equal(result.code, 'ABCD1234');
    assert.equal(result.handshakeStatus, 'accepted');
    assert.ok(result.handshakeWaitMs >= 0);
    assert.equal(db._getStatus(), 'linking');
    assert.ok(mgr.pairingInProgress.has(accountId));
    assert.equal(events[0].status, 'pending');
    assert.equal(events.at(-1).type, 'pairing_code');
    assert.equal(events.at(-1).code, 'ABCD1234');

    cleanupManager(mgr, accountId);
  });

  test('Connection Failure (blocked proxy) rejects with 422 semantics and reverts status', async () => {
    handshakeUpdateAfterCode = connectionFailureClose(405);
    const db = createMockDb('linking');
    const mgr = createIntegrationManager(db);
    const accountId = 'acc-reject-int';
    const codeEvents = [];

    mgr.on('pairing_code', (payload) => codeEvents.push(payload));

    const err = await mgr.requestPairingCode(accountId, '+15559876543').catch((e) => e);
    assert.ok(err instanceof HandshakeRejectedError);
    assert.equal(err.handshakeStatus, 'rejected');
    assert.equal(err.status, 422);
    assert.equal(err.statusCode, 405);

    assert.equal(db._getStatus(), 'primary_registered');
    assert.equal(codeEvents.length, 0);
    assert.equal(mgr.pairingInProgress.has(accountId), false);
    // Failed handshake tears down the socket so QR/reconnect spam does not continue
    assert.equal(activeSockets.has(accountId), false);
    assert.equal(mgr._suppressReconnect.has(accountId), true);

    cleanupManager(mgr, accountId);
    mgr._suppressReconnect.delete(accountId);
  });

  test('ambiguous timeout tears down socket and returns 422 semantics', async () => {
    handshakeUpdateAfterCode = null;
    const db = createMockDb('linking');
    const mgr = createIntegrationManager(db);
    mgr.HANDSHAKE_WAIT_MS = 60;
    const accountId = 'acc-ambiguous-int';
    const codeEvents = [];

    mgr.on('pairing_code', (payload) => codeEvents.push(payload));

    const err = await mgr.requestPairingCode(accountId, '+15559876543').catch((e) => e);
    assert.ok(err instanceof HandshakeRejectedError);
    assert.equal(err.handshakeStatus, 'ambiguous');
    assert.equal(err.status, 422);
    assert.equal(err.reason, 'timeout');

    assert.equal(db._getStatus(), 'primary_registered');
    assert.equal(codeEvents.length, 0);
    assert.equal(mgr.pairingInProgress.has(accountId), false);
    assert.equal(activeSockets.has(accountId), false);
    assert.equal(mgr._suppressReconnect.has(accountId), true);

    cleanupManager(mgr, accountId);
    mgr._suppressReconnect.delete(accountId);
  });

  test('connection.update close guard keeps linking on restartRequired (not offline)', async () => {
    handshakeUpdateAfterCode = restartRequiredClose();
    const db = createMockDb('linking');
    const mgr = createIntegrationManager(db);
    const accountId = 'acc-guard-int';

    const pending = mgr.requestPairingCode(accountId, '+15559876543');
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(db._getStatus(), 'linking');

    await pending;
    assert.equal(db._getStatus(), 'linking');
    assert.notEqual(db._getStatus(), 'offline');

    cleanupManager(mgr, accountId);
  });

  test('getPairingCodes includePending surfaces pending handshake phase', async () => {
    handshakeUpdateAfterCode = null;
    latestMockSocket = null;

    const db = createMockDb('linking');
    const mgr = createIntegrationManager(db);
    const accountId = 'acc-pending-int';

    const inflight = mgr.requestPairingCode(accountId, '+15559876543');

    await new Promise((r) => setTimeout(r, 15));
    assert.ok(latestMockSocket);

    const pendingCodes = mgr.getPairingCodes({ includePending: true });
    assert.ok(pendingCodes.some((c) => c.accountId === accountId && c.handshakeStatus === 'pending'));
    assert.equal(pendingCodes.find((c) => c.accountId === accountId).code, undefined);

    await latestMockSocket.fireConnectionUpdate(restartRequiredClose());
    await inflight;

    const acceptedCodes = mgr.getPairingCodes({ includePending: false });
    assert.ok(acceptedCodes.some((c) => c.accountId === accountId && c.code === 'ABCD1234'));

    cleanupManager(mgr, accountId);
  });

  test('connection open after accepted handshake sets ws_accounts linked', async () => {
    handshakeUpdateAfterCode = restartRequiredClose();
    const db = createMockDb('linking');
    const mgr = createIntegrationManager(db);
    const accountId = 'acc-open-int';

    await mgr.requestPairingCode(accountId, '+15559876543');
    assert.equal(db._getStatus(), 'linking');

    await latestMockSocket.fireConnectionUpdate({ connection: 'open' });
    assert.equal(db._getStatus(), 'linked');
    assert.equal(mgr.pairingInProgress.has(accountId), false);

    cleanupManager(mgr, accountId);
  });
});