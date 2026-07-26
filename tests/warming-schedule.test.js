/**
 * Unit tests for warming calendar-session schedule (no Redis / WA).
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  sessionsPerDay,
  sessionsPerDayForProgress,
  tierForDay,
  advanceAfterSession,
  shouldFinalizeDayOnly,
  finalizeDay,
  peerMessageCount,
  scaleMs,
  DAY_SPAN_MS,
  SESSION_GAPS_MS,
} from '../src/core/warming/schedule.js';

const HOUR = 3_600_000;

describe('sessionsPerDay', () => {
  it('gives 3 sessions for 1-day normal warm', () => {
    assert.equal(sessionsPerDay({ mode: 'normal', targetDays: 1 }), 3);
  });
  it('gives 4 sessions for 1-day fast warm', () => {
    assert.equal(sessionsPerDay({ mode: 'fast_warm', targetDays: 1 }), 4);
  });
  it('respects override cap 6', () => {
    assert.equal(sessionsPerDay({ mode: 'normal', targetDays: 10, override: 99 }), 6);
  });
});

describe('tierForDay', () => {
  it('maps light/medium/active bands', () => {
    assert.equal(tierForDay(0), 'light');
    assert.equal(tierForDay(2), 'light');
    assert.equal(tierForDay(3), 'medium');
    assert.equal(tierForDay(7), 'active');
  });
});

describe('advanceAfterSession — 1-day warm', () => {
  const baseTask = {
    mode: 'normal',
    target_days: 1,
    progress_days: 0,
    sessions_completed_today: 0,
    current_day_started_at: null,
  };
  const t0 = Date.parse('2026-07-01T08:00:00.000Z');
  const fixedRng = (min) => min; // deterministic gaps

  it('does not complete day after first session alone', () => {
    const r = advanceAfterSession(baseTask, { now: t0, scale: 1, rng: fixedRng });
    assert.equal(r.sessions_completed_today, 1);
    assert.equal(r.progress_days, 0);
    assert.equal(r.dayCompleted, false);
    assert.equal(r.isDone, false);
    assert.ok(r.nextDelayMs >= SESSION_GAPS_MS.normal.min);
  });

  it('after all sessions but before day span, waits remaining span', () => {
    const task = {
      ...baseTask,
      sessions_completed_today: 2, // next will be 3/3
      current_day_started_at: new Date(t0).toISOString(),
    };
    // only 1 hour into the day
    const r = advanceAfterSession(task, { now: t0 + HOUR, scale: 1, rng: fixedRng });
    assert.equal(r.sessions_completed_today, 3);
    assert.equal(r.progress_days, 0);
    assert.equal(r.dayCompleted, false);
    assert.equal(r.isDone, false);
    // remaining ≈ 22h - 1h
    assert.ok(r.nextDelayMs > 20 * HOUR);
    assert.ok(r.nextDelayMs <= DAY_SPAN_MS.normal);
  });

  it('completes 1-day warm when sessions done and span elapsed', () => {
    const task = {
      ...baseTask,
      sessions_completed_today: 2,
      current_day_started_at: new Date(t0).toISOString(),
    };
    const r = advanceAfterSession(task, {
      now: t0 + DAY_SPAN_MS.normal + HOUR,
      scale: 1,
      rng: fixedRng,
    });
    assert.equal(r.sessions_completed_today, 0);
    assert.equal(r.progress_days, 1);
    assert.equal(r.dayCompleted, true);
    assert.equal(r.isDone, true);
    assert.equal(r.nextDelayMs, 0);
  });
});

describe('shouldFinalizeDayOnly + finalizeDay', () => {
  const t0 = Date.parse('2026-07-01T08:00:00.000Z');

  it('false when sessions incomplete', () => {
    const task = {
      mode: 'normal',
      target_days: 1,
      progress_days: 0,
      sessions_completed_today: 1,
      current_day_started_at: new Date(t0).toISOString(),
    };
    assert.equal(shouldFinalizeDayOnly(task, { now: t0 + DAY_SPAN_MS.normal, scale: 1 }), false);
  });

  it('true when sessions full and span met', () => {
    const task = {
      mode: 'normal',
      target_days: 1,
      progress_days: 0,
      sessions_completed_today: 3,
      current_day_started_at: new Date(t0).toISOString(),
    };
    assert.equal(shouldFinalizeDayOnly(task, { now: t0 + DAY_SPAN_MS.normal, scale: 1 }), true);
    const fin = finalizeDay(task, { now: t0 + DAY_SPAN_MS.normal, scale: 1, rng: (a) => a });
    assert.equal(fin.progress_days, 1);
    assert.equal(fin.isDone, true);
  });
});

describe('scaleMs / WARMING_TIME_SCALE path', () => {
  it('scales delays for compressed test runs', () => {
    assert.equal(scaleMs(HOUR, 0.001), 3600);
    assert.equal(scaleMs(HOUR, 1), HOUR);
  });
});

describe('peerMessageCount', () => {
  it('bootstrap session on short warm can send 1–2 peers', () => {
    assert.equal(peerMessageCount({ tier: 'light', mode: 'normal', sessionIndex: 0, isShortWarm: true }), 1);
    assert.equal(peerMessageCount({ tier: 'light', mode: 'fast_warm', sessionIndex: 0, isShortWarm: true }), 2);
  });
});

describe('sessionsPerDayForProgress multi-day', () => {
  it('increases sessions in active tier for fast_warm', () => {
    const light = sessionsPerDayForProgress({ mode: 'fast_warm', targetDays: 10, progressDays: 0 });
    const active = sessionsPerDayForProgress({ mode: 'fast_warm', targetDays: 10, progressDays: 8 });
    assert.ok(active >= light);
  });
});
