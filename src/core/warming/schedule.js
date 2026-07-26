/**
 * Pure schedule helpers for warming sessions (real calendar-day pacing).
 *
 * Env:
 *   WARMING_TIME_SCALE — multiply delays (default 1). Use e.g. 0.001 for tests/dev.
 */

const HOUR = 3_600_000;

export const SESSION_GAPS_MS = {
  normal: { min: 6 * HOUR, max: 10 * HOUR },
  fast_warm: { min: 3 * HOUR, max: 5 * HOUR },
};

export const DAY_SPAN_MS = {
  normal: 22 * HOUR,
  fast_warm: 16 * HOUR,
};

/** Overnight gap after a day completes before day N+1 bootstrap */
export const OVERNIGHT_GAP_MS = {
  normal: { min: 4 * HOUR, max: 8 * HOUR },
  fast_warm: { min: 2 * HOUR, max: 4 * HOUR },
};

export function getTimeScale() {
  const raw = process.env.WARMING_TIME_SCALE;
  if (raw === undefined || raw === '') return 1;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 1;
  return n;
}

export function scaleMs(ms, scale = getTimeScale()) {
  return Math.max(0, Math.round(ms * scale));
}

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickMode(mode) {
  return mode === 'fast_warm' ? 'fast_warm' : 'normal';
}

/**
 * How many sessions per calendar warm day.
 * Short warms (1–2 days) get a fuller single-day plan.
 */
export function sessionsPerDay({ mode, targetDays, override } = {}) {
  if (override != null && override > 0) return Math.min(6, Math.floor(override));
  const m = pickMode(mode);
  const days = targetDays || 10;
  if (days <= 1) return m === 'fast_warm' ? 4 : 3;
  if (days <= 2) return m === 'fast_warm' ? 3 : 3;
  // multi-day ramp by "current" tier is applied via day index in worker; base:
  return m === 'fast_warm' ? 3 : 2;
}

/**
 * Sessions per day given completed progress day (0-based).
 */
export function sessionsPerDayForProgress({ mode, targetDays, progressDays, override } = {}) {
  if (override != null && override > 0) return Math.min(6, Math.floor(override));
  const m = pickMode(mode);
  const day = progressDays || 0;
  const target = targetDays || 10;
  if (target <= 2) return sessionsPerDay({ mode: m, targetDays: target });

  // light / medium / active
  if (day < 3) return m === 'fast_warm' ? 3 : 2;
  if (day < 7) return 3;
  return m === 'fast_warm' ? 4 : 3;
}

export function daySpanMs(mode) {
  return DAY_SPAN_MS[pickMode(mode)];
}

export function sessionGapMs(mode, rng = randInt) {
  const g = SESSION_GAPS_MS[pickMode(mode)];
  return rng(g.min, g.max);
}

export function overnightGapMs(mode, rng = randInt) {
  const g = OVERNIGHT_GAP_MS[pickMode(mode)];
  return rng(g.min, g.max);
}

/**
 * Behavior tier from completed days (same bands as before).
 * Short 1-day warms stay "light" for volume but still run full handshake.
 */
export function tierForDay(progressDays = 0) {
  if (progressDays < 3) return 'light';
  if (progressDays < 7) return 'medium';
  return 'active';
}

/**
 * After a session finishes, compute progress patch + next delay.
 *
 * @param {object} task - warming_tasks row
 * @param {object} [opts]
 * @param {number} [opts.now] - epoch ms
 * @param {number} [opts.scale]
 * @param {function} [opts.rng]
 * @returns {{
 *   sessions_completed_today: number,
 *   progress_days: number,
 *   current_day_started_at: Date|string|null,
 *   last_session_at: Date,
 *   dayCompleted: boolean,
 *   isDone: boolean,
 *   nextDelayMs: number,
 *   sessionsPerDay: number,
 * }}
 */
export function advanceAfterSession(task, opts = {}) {
  const now = opts.now ?? Date.now();
  const scale = opts.scale ?? getTimeScale();
  const rng = opts.rng ?? randInt;
  const mode = pickMode(task.mode);
  const targetDays = task.target_days || 10;
  const progressBefore = task.progress_days || 0;
  const perDay = sessionsPerDayForProgress({
    mode,
    targetDays,
    progressDays: progressBefore,
    override: task.sessions_per_day,
  });

  let sessionsToday = task.sessions_completed_today || 0;
  let dayStarted = task.current_day_started_at
    ? new Date(task.current_day_started_at).getTime()
    : null;

  if (!dayStarted) dayStarted = now;
  sessionsToday += 1;

  const lastSessionAt = new Date(now);
  const span = scaleMs(daySpanMs(mode), scale);
  const elapsed = now - dayStarted;

  let progressDays = progressBefore;
  let dayCompleted = false;
  let nextDelayMs = scaleMs(sessionGapMs(mode, rng), scale);
  let currentDayStartedAt = new Date(dayStarted);

  if (sessionsToday >= perDay) {
    // All sessions for this warm-day done — wait for day span if needed, then advance.
    if (elapsed >= span) {
      dayCompleted = true;
      progressDays = progressBefore + 1;
      sessionsToday = 0;
      currentDayStartedAt = null;
      nextDelayMs = scaleMs(overnightGapMs(mode, rng), scale);
    } else {
      // Hold day open until span met; next "session" is effectively a wait-then-advance.
      nextDelayMs = Math.max(0, span - elapsed);
      // Mark sessions complete; worker will treat "sessions full + elapsed>=span" next time
      // OR we schedule a finalize with zero work — handled by canFinalizeDay in worker.
    }
  }

  const isDone = progressDays >= targetDays;

  return {
    sessions_completed_today: sessionsToday,
    progress_days: progressDays,
    current_day_started_at: currentDayStartedAt,
    last_session_at: lastSessionAt,
    dayCompleted,
    isDone,
    nextDelayMs: isDone ? 0 : nextDelayMs,
    sessionsPerDay: perDay,
  };
}

/**
 * If last run finished all sessions but day span not yet met, a follow-up job
 * may only need to finalize the day without another full behavior session.
 */
export function shouldFinalizeDayOnly(task, opts = {}) {
  const now = opts.now ?? Date.now();
  const scale = opts.scale ?? getTimeScale();
  const mode = pickMode(task.mode);
  const progressBefore = task.progress_days || 0;
  const perDay = sessionsPerDayForProgress({
    mode,
    targetDays: task.target_days || 10,
    progressDays: progressBefore,
    override: task.sessions_per_day,
  });
  const sessionsToday = task.sessions_completed_today || 0;
  if (sessionsToday < perDay) return false;
  if (!task.current_day_started_at) return false;
  const span = scaleMs(daySpanMs(mode), scale);
  const elapsed = now - new Date(task.current_day_started_at).getTime();
  return elapsed >= span;
}

/**
 * Finalize day after wait (no extra session work).
 */
export function finalizeDay(task, opts = {}) {
  const now = opts.now ?? Date.now();
  const scale = opts.scale ?? getTimeScale();
  const rng = opts.rng ?? randInt;
  const mode = pickMode(task.mode);
  const targetDays = task.target_days || 10;
  const progressDays = (task.progress_days || 0) + 1;
  const isDone = progressDays >= targetDays;
  return {
    sessions_completed_today: 0,
    progress_days: progressDays,
    current_day_started_at: null,
    last_session_at: new Date(now),
    dayCompleted: true,
    isDone,
    nextDelayMs: isDone ? 0 : scaleMs(overnightGapMs(mode, rng), scale),
    sessionsPerDay: sessionsPerDayForProgress({
      mode,
      targetDays,
      progressDays: task.progress_days || 0,
      override: task.sessions_per_day,
    }),
  };
}

/** Peer message count for a session */
export function peerMessageCount({ tier, mode, sessionIndex = 0, isShortWarm = false }) {
  const m = pickMode(mode);
  if (isShortWarm) {
    // bootstrap denser intro, later lighter
    if (sessionIndex === 0) return m === 'fast_warm' ? 2 : 1;
    return 1;
  }
  if (tier === 'light') return 1;
  if (tier === 'medium') return m === 'fast_warm' ? 2 : 1;
  return m === 'fast_warm' ? 2 : 1;
}

export default {
  getTimeScale,
  scaleMs,
  sessionsPerDay,
  sessionsPerDayForProgress,
  daySpanMs,
  sessionGapMs,
  overnightGapMs,
  tierForDay,
  advanceAfterSession,
  shouldFinalizeDayOnly,
  finalizeDay,
  peerMessageCount,
  SESSION_GAPS_MS,
  DAY_SPAN_MS,
};
