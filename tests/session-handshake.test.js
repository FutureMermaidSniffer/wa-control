import { describe, test, before } from 'node:test';
import assert from 'node:assert/strict';
import {
  restartRequiredClose,
  connectionFailureClose,
  connectingUpdate,
  qrUpdate,
} from './fixtures/connection-updates.js';

process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'wa_control_test';
process.env.DB_USER = 'test';
process.env.DB_PASSWORD = 'testpassword32charsminimumhere!!';
process.env.JWT_SECRET = 'test-jwt-secret-minimum-32-characters!!';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars-min!!';
delete process.env.PAIRING_HANDSHAKE_GATE;

function createMockDb(initialStatus = 'linking') {
  let status = initialStatus;
  const updates = [];

  const db = (table) => ({
    where: (cond) => ({
      first: async () => {
        if (table === 'ws_accounts') {
          return {
            id: cond.id || 'acc-1',
            phone: '+15551234567',
            status,
            proxy_id: null,
            baileys_auth_state: null,
          };
        }
        return null;
      },
      update: async (patch) => {
        updates.push({ table, cond, patch });
        if (patch.status !== undefined) status = patch.status;
        return 1;
      },
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

// Stub mirroring connection.update close-branch guard logic (not the real handler).
// PR4 integration tests will exercise the full sock.ev.on('connection.update') path.
async function simulateCloseOfflineGuard(mgr, accountId, shouldReconnect = true) {
  const awaitingPairing = mgr.pairingInProgress.has(accountId);
  const handshakePhaseActive = mgr._isHandshakePhaseActive(accountId);
  if (!awaitingPairing && !handshakePhaseActive) {
    await mgr.db('ws_accounts').where({ id: accountId }).update({
      status: shouldReconnect ? 'offline' : 'error',
    });
  }
}

let SessionManager;
let activeSockets;
let HandshakeRejectedError;
let InFlightHandshakeError;

let resolveHandshakeTimerMs;

before(async () => {
  ({ SessionManager, activeSockets, resolveHandshakeTimerMs } = await import('../src/core/sessions/SessionManager.js'));
  ({ HandshakeRejectedError, InFlightHandshakeError } = await import('../src/core/sessions/errors.js'));
});

function createManager(db, { gate = false, weakMs = 50, waitMs = 200 } = {}) {
  const mgr = new SessionManager(db);
  mgr.handshakeGateEnabled = gate;
  mgr.HANDSHAKE_WEAK_ACCEPT_MS = weakMs;
  mgr.HANDSHAKE_WAIT_MS = waitMs;
  return mgr;
}

function cleanupHandshake(mgr, accountId) {
  mgr._clearHandshakeWait(accountId);
  mgr._handshakePhase.delete(accountId);
  mgr.pairingInProgress.delete(accountId);
  const rem = mgr._pairingReminders?.get(accountId);
  if (rem) {
    clearInterval(rem);
    mgr._pairingReminders.delete(accountId);
  }
  activeSockets.delete(accountId);
}

describe('SessionManager handshake gate', () => {
  test('handshakeGateEnabled follows createManager gate option', async () => {
    const db = createMockDb();
    const mgrOff = createManager(db, { gate: false });
    const mgrOn = createManager(db, { gate: true });
    assert.equal(mgrOff.handshakeGateEnabled, false);
    assert.equal(mgrOn.handshakeGateEnabled, true);
  });

  test('_resetPairingAuth does not clear _handshakeInFlight', async () => {
    const db = createMockDb();
    const mgr = createManager(db, { gate: true });
    const inflight = new Promise(() => {});
    mgr._handshakeInFlight.set('acc-1', inflight);

    await mgr._resetPairingAuth('acc-1');

    assert.equal(mgr._handshakeInFlight.get('acc-1'), inflight);
    mgr._handshakeInFlight.delete('acc-1');
  });

  test('_teardownFailedPairing ends socket; suppress only when requested', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { gate: true });
    const accountId = 'acc-teardown';
    let ended = false;
    activeSockets.set(accountId, {
      sock: {
        end() {
          ended = true;
        },
      },
      account: { id: accountId, phone: '+15550001111' },
      proxy: null,
    });
    mgr.pairingInProgress.set(accountId, { phone: '+15550001111', code: 'DEADCODE', startedAt: Date.now() });

    // Soft teardown (retryable) — do not suppress reconnect
    await mgr._teardownFailedPairing(accountId, { reason: 'test', skipStatusRevert: true, suppressReconnect: false });
    assert.equal(ended, true);
    assert.equal(activeSockets.has(accountId), false);
    assert.equal(mgr.pairingInProgress.has(accountId), false);
    assert.equal(mgr._suppressReconnect.has(accountId), false);

    // Terminal teardown
    ended = false;
    activeSockets.set(accountId, {
      sock: { end() { ended = true; } },
      account: { id: accountId, phone: '+15550001111' },
      proxy: null,
    });
    await mgr._teardownFailedPairing(accountId, { reason: 'loggedOut', skipStatusRevert: true, suppressReconnect: true });
    assert.equal(ended, true);
    assert.equal(mgr._suppressReconnect.has(accountId), true);

    mgr._suppressReconnect.delete(accountId);
  });

  test('_resetPairingAuth preserves linking status when handshake in flight', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { gate: true });
    mgr._handshakeInFlight.set('acc-linking', new Promise(() => {}));

    await mgr._resetPairingAuth('acc-linking');

    assert.equal(db._getStatus(), 'linking');
    const authReset = db._updates.find((u) => u.patch.baileys_auth_state === null);
    assert.ok(authReset);
    assert.equal(authReset.patch.status, undefined);
    mgr._handshakeInFlight.delete('acc-linking');
  });

  test('_resetPairingAuth reverts to primary_registered when not in flight', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db);

    await mgr._resetPairingAuth('acc-legacy');

    assert.equal(db._getStatus(), 'primary_registered');
  });

  test('resolveHandshakeTimerMs clamps WAIT below WEAK', () => {
    const timers = resolveHandshakeTimerMs(5000, 12000);
    assert.equal(timers.handshakeWaitMs, 15000);
    assert.equal(timers.handshakeWeakAcceptMs, 12000);
    assert.ok(timers.handshakeWaitMs >= timers.handshakeWeakAcceptMs);
  });

  test('gated path arms handshake waiter before requestPairingCode', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { gate: true });
    const accountId = 'acc-gated-order';
    const order = [];

    mgr._resetPairingAuth = async () => {
      order.push('reset');
    };
    mgr._preparePairingSocketForCode = async () => {
      order.push('prepare');
      return { sock: { requestPairingCode: async () => 'CODE1234' } };
    };
    mgr._armHandshakeWait = (...args) => {
      order.push('arm');
      return Promise.resolve({ status: 'accepted', handshakeWaitMs: 5, reason: 'restartRequired' });
    };
    mgr._requestPairingCodeFromSocket = async () => {
      order.push('requestCode');
      return 'CODE1234';
    };
    mgr._showPairingCodeBanner = () => {};
    mgr._startPairingReminder = () => {};

    const result = await mgr.requestPairingCode(accountId, '+15551234567');
    assert.deepEqual(order, ['reset', 'prepare', 'arm', 'requestCode']);
    assert.equal(result.code, 'CODE1234');
    assert.equal(result.handshakeStatus, 'accepted');
    mgr.pairingInProgress.delete(accountId);
  });

  test('fast post-hello close captured when waiter armed before companion_hello', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { gate: true, waitMs: 5000, weakMs: 4000 });
    const accountId = 'acc-fast-close';

    const handshakePromise = mgr._armHandshakeWait(accountId, '+15551234567');
    await mgr._resolveHandshakeWait(accountId, restartRequiredClose());

    const result = await handshakePromise;
    assert.equal(result.status, 'accepted');
    assert.equal(mgr._handshakeWaiters.has(accountId), false);
    cleanupHandshake(mgr, accountId);
  });

  test('overlapping gated calls throw InFlightHandshakeError without clearing first inflight', async () => {
    const db = createMockDb();
    const mgr = createManager(db, { gate: true });
    const inflight = new Promise(() => {});
    mgr._handshakeInFlight.set('acc-1', inflight);

    await assert.rejects(
      () => mgr.requestPairingCode('acc-1', '+15551234567'),
      (err) => {
        assert.ok(err instanceof InFlightHandshakeError);
        assert.equal(err.status, 409);
        return true;
      }
    );

    assert.equal(mgr._handshakeInFlight.get('acc-1'), inflight);
    mgr._handshakeInFlight.delete('acc-1');
  });

  test('resolves accepted on restartRequired close', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { waitMs: 5000, weakMs: 4000 });
    const accountId = 'acc-accept';

    const promise = mgr._armHandshakeWait(accountId, '+15551234567');
    await mgr._resolveHandshakeWait(accountId, restartRequiredClose());

    const result = await promise;
    assert.equal(result.status, 'accepted');
    assert.equal(result.reason, 'restartRequired');
    assert.ok(result.handshakeWaitMs >= 0);
    assert.equal(mgr._handshakePhase.get(accountId).status, 'accepted');
    cleanupHandshake(mgr, accountId);
  });

  test('rejects on Connection Failure and reverts linking status', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { waitMs: 5000, weakMs: 4000 });
    const accountId = 'acc-reject';

    const promise = mgr._armHandshakeWait(accountId, '+15551234567');
    await mgr._resolveHandshakeWait(accountId, connectionFailureClose(405));
    const err = await promise.catch((e) => e);

    assert.ok(err instanceof HandshakeRejectedError);
    assert.equal(err.handshakeStatus, 'rejected');
    assert.equal(err.status, 422);
    assert.equal(db._getStatus(), 'primary_registered');
    assert.equal(mgr._handshakePhase.get(accountId).status, 'rejected');
    cleanupHandshake(mgr, accountId);
  });

  test('Connection Failure close guard skips offline update', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { waitMs: 5000, weakMs: 4000 });
    const accountId = 'acc-cf-guard';

    const promise = mgr._armHandshakeWait(accountId, '+15551234567');
    await mgr._resolveHandshakeWait(accountId, connectionFailureClose(405));
    await assert.rejects(promise);

    await simulateCloseOfflineGuard(mgr, accountId);
    assert.equal(db._getStatus(), 'primary_registered');
    assert.notEqual(db._getStatus(), 'offline');
    cleanupHandshake(mgr, accountId);
  });

  test('restartRequired close guard keeps linking status (not offline)', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { waitMs: 5000, weakMs: 4000 });
    const accountId = 'acc-rr-guard';

    const promise = mgr._armHandshakeWait(accountId, '+15551234567');
    await mgr._resolveHandshakeWait(accountId, restartRequiredClose());
    await promise;

    assert.equal(mgr.pairingInProgress.has(accountId), false);
    assert.equal(mgr._isHandshakePhaseActive(accountId), true);

    await simulateCloseOfflineGuard(mgr, accountId);
    assert.equal(db._getStatus(), 'linking');
    cleanupHandshake(mgr, accountId);
  });

  test('weak accept resolves when socket still open at weak deadline', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { weakMs: 40, waitMs: 200 });
    const accountId = 'acc-weak';
    activeSockets.set(accountId, { sock: { ws: { isOpen: true } } });

    const promise = mgr._armHandshakeWait(accountId, '+15551234567');
    mgr._markCompanionHelloSent(accountId);
    const result = await promise;
    assert.equal(result.status, 'accepted_weak');
    assert.equal(result.reason, 'socket_open_at_weak_deadline');

    cleanupHandshake(mgr, accountId);
  });

  test('post-pairing QR rejects handshake (no false weak accept)', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { weakMs: 200, waitMs: 500 });
    const accountId = 'acc-qr-reject';

    const promise = mgr._armHandshakeWait(accountId, '+15551234567');
    mgr._markCompanionHelloSent(accountId);
    await mgr._rejectHandshakeWait(accountId, {
      handshakeStatus: 'rejected',
      reason: 'post_pairing_qr_fallback',
    });

    const err = await promise.catch((e) => e);
    assert.ok(err instanceof HandshakeRejectedError);
    assert.equal(err.handshakeStatus, 'rejected');
    assert.equal(err.reason, 'post_pairing_qr_fallback');
    assert.equal(db._getStatus(), 'primary_registered');

    cleanupHandshake(mgr, accountId);
  });

  test('weak accept skipped when post-pairing QR already seen', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { weakMs: 40, waitMs: 200 });
    const accountId = 'acc-skip-weak';
    activeSockets.set(accountId, { sock: { ws: { isOpen: true } } });

    mgr._armHandshakeWait(accountId, '+15551234567');
    const waiter = mgr._handshakeWaiters.get(accountId);
    mgr._markCompanionHelloSent(accountId);
    waiter.postPairingQrSeen = true;

    await new Promise((r) => setTimeout(r, 60));
    assert.equal(mgr._handshakePhase.get(accountId).status, 'pending');

    cleanupHandshake(mgr, accountId);
  });

  test('hard timeout rejects ambiguous after weak deadline', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { weakMs: 30, waitMs: 80 });
    const accountId = 'acc-timeout';
    activeSockets.set(accountId, { sock: { ws: { isOpen: false } } });

    const err = await mgr._armHandshakeWait(accountId, '+15551234567').catch((e) => e);
    assert.ok(err instanceof HandshakeRejectedError);
    assert.equal(err.handshakeStatus, 'ambiguous');
    assert.equal(db._getStatus(), 'primary_registered');
    assert.equal(mgr._handshakePhase.get(accountId).status, 'ambiguous');

    cleanupHandshake(mgr, accountId);
  });

  test('timer ordering: weak fires before hard timeout', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { weakMs: 40, waitMs: 120 });
    const accountId = 'acc-order';
    activeSockets.set(accountId, { sock: { ws: { isOpen: true } } });

    const events = [];
    const promise = mgr._armHandshakeWait(accountId, '+15551234567').then((r) => {
      events.push(`resolved:${r.status}`);
    });
    mgr._markCompanionHelloSent(accountId);

    await new Promise((r) => setTimeout(r, 45));
    await promise;
    events.push('after-weak');

    await new Promise((r) => setTimeout(r, 80));
    events.push('after-hard-window');

    assert.deepEqual(events, ['resolved:accepted_weak', 'after-weak', 'after-hard-window']);

    cleanupHandshake(mgr, accountId);
  });

  test('weak timer skipped when HANDSHAKE_WEAK_ACCEPT_MS is 0', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { weakMs: 0, waitMs: 5000 });
    const accountId = 'acc-no-weak';

    mgr._armHandshakeWait(accountId, '+15551234567');
    const waiter = mgr._handshakeWaiters.get(accountId);
    assert.equal(waiter.weakTimer, null);

    cleanupHandshake(mgr, accountId);
  });

  test('non-close updates are no-op while waiter armed', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { waitMs: 5000, weakMs: 4000 });
    const accountId = 'acc-noop';

    mgr._armHandshakeWait(accountId, '+15551234567');
    await mgr._resolveHandshakeWait(accountId, connectingUpdate());

    assert.ok(mgr._handshakeWaiters.has(accountId));
    assert.equal(mgr._handshakePhase.get(accountId).status, 'pending');

    cleanupHandshake(mgr, accountId);
  });

  test('resolve is idempotent for stale close events', async () => {
    const db = createMockDb('linking');
    const mgr = createManager(db, { waitMs: 5000, weakMs: 4000 });
    const accountId = 'acc-idempotent';

    const promise = mgr._armHandshakeWait(accountId, '+15551234567');
    await mgr._resolveHandshakeWait(accountId, restartRequiredClose());
    await promise;

    await mgr._resolveHandshakeWait(accountId, connectionFailureClose());
    assert.equal(mgr._handshakePhase.get(accountId).status, 'accepted');
    cleanupHandshake(mgr, accountId);
  });

  test('getPairingCodes includes pending phases when includePending=true', () => {
    const db = createMockDb();
    const mgr = createManager(db);

    mgr.pairingInProgress.set('acc-ok', {
      phone: '+1',
      code: 'ABCD1234',
      startedAt: Date.now(),
      handshakeStatus: 'accepted',
      handshakeWaitMs: 10,
    });
    mgr._handshakePhase.set('acc-pending', {
      phone: '+2',
      status: 'pending',
      startedAt: Date.now(),
    });

    const codes = mgr.getPairingCodes({ includePending: true });
    assert.equal(codes.length, 2);
    assert.ok(codes.some((c) => c.accountId === 'acc-ok' && c.code === 'ABCD1234'));
    assert.ok(codes.some((c) => c.accountId === 'acc-pending' && c.handshakeStatus === 'pending'));
    assert.equal(codes.find((c) => c.accountId === 'acc-pending').code, undefined);
  });
});