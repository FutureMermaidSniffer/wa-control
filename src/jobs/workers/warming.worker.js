/**
 * Warming worker — calendar-day sessions + peer contact-save longevity.
 *
 * Each job runs ONE session (or a day-finalize wait), not a whole "day".
 * - Real inter-session delays (hours), scaled by WARMING_TIME_SCALE for tests.
 * - First peer interaction: mutual contact save + intro messages.
 * - progress_days advances only when the calendar warm-day is complete.
 */
import { Worker } from 'bullmq';
import { getConnection, scheduleWarmingTask } from '../queues.js';
import db from '../../db/connection.js';
import { getSessionEngine } from '../../core/engine/SessionEngine.js';
import { logger } from '../../utils/logger.js';
import warmingData from '../../data/warming.data.js';
import {
  advanceAfterSession,
  shouldFinalizeDayOnly,
  finalizeDay,
  tierForDay,
  peerMessageCount,
  sessionsPerDayForProgress,
  daySpanMs,
  scaleMs,
  getTimeScale,
  pickMode,
} from '../../core/warming/schedule.js';
import createPeerHandshake from '../../core/warming/peerHandshake.js';
import createBehaviors from '../../core/warming/behaviors.js';

function buildSession() {
  const engine = getSessionEngine();
  return {
    connectAccount: (...a) => engine.connectAccount(...a),
    getOrCreateSocket: (...a) => engine.getOrCreateSocket(...a),
    updateProfile: (...a) => engine.updateProfile(...a),
    sendText: (...a) => engine.sendText(...a),
    saveContact: (...a) => engine.saveContact(...a),
    isSocketLive: (id) => engine.isSocketLive?.(id) ?? false,
  };
}

export function startWarmingWorker() {
  const session = buildSession();
  const handshake = createPeerHandshake({ session });
  const behaviors = createBehaviors(session);

  const worker = new Worker(
    'warming',
    async (job) => {
      const { taskId } = job.data;
      logger.info('Warming job started', { taskId, jobId: job.id });

      const task = await warmingData.getTask(taskId);
      if (!task) throw new Error('Task not found');

      if (task.status === 'paused' || task.status === 'completed') {
        logger.info('Skipping warming task', { taskId, status: task.status });
        return { skipped: true };
      }

      const acc = await db('ws_accounts').where({ id: task.ws_account_id }).first();
      if (!acc) throw new Error(`ws_account ${task.ws_account_id} not found`);

      // Safety: health gate
      if ((acc.health_score || 100) < 30) {
        logger.warn('Warming paused: health_score too low', {
          taskId, phone: acc.phone, score: acc.health_score,
        });
        await warmingData.updateTask(taskId, { status: 'paused' });
        return { skipped: true, reason: 'health_score_too_low' };
      }

      // Global ban signal
      const recentErrors = await db('ws_accounts')
        .where('status', 'error')
        .where('updated_at', '>', db.raw("NOW() - INTERVAL '1 hour'"))
        .count('id as n')
        .first();
      if (parseInt(recentErrors?.n || 0, 10) > 5) {
        logger.error('GLOBAL BAN SIGNAL — pausing warming', { taskId });
        await warmingData.updateTask(taskId, { status: 'paused' });
        return { skipped: true, reason: 'global_ban_signal' };
      }

      const day = task.progress_days || 0;
      const sessionIndex = task.sessions_completed_today || 0;
      const isFast = task.mode === 'fast_warm';
      const isShortWarm = (task.target_days || 10) <= 2;
      const tier = tierForDay(day);
      const perDay = sessionsPerDayForProgress({
        mode: task.mode,
        targetDays: task.target_days,
        progressDays: day,
        override: task.sessions_per_day,
      });

      // Sessions for this warm-day already done — finalize or wait for day span (no extra work)
      if (sessionIndex >= perDay) {
        if (shouldFinalizeDayOnly(task)) {
          const fin = finalizeDay(task);
          await applyProgressAndMaybeReschedule(taskId, task, acc, fin, job);
          return {
            finalizeOnly: true,
            progress: fin.progress_days,
            done: fin.isDone,
          };
        }
        const started = task.current_day_started_at
          ? new Date(task.current_day_started_at).getTime()
          : Date.now();
        const span = scaleMs(daySpanMs(pickMode(task.mode)), getTimeScale());
        const waitMs = Math.max(5_000, span - (Date.now() - started));
        await scheduleWarmingTask(taskId, waitMs);
        logger.info('Warming waiting for day span before advance', {
          taskId, phone: acc.phone, waitMs, perDay, sessionIndex,
        });
        return { waitingForDaySpan: true, waitMs };
      }

      try {
        await session.connectAccount(task.ws_account_id);
      } catch (e) {
        logger.warn('Failed to ensure session for warm', { taskId, error: e.message });
      }

      await job.updateProgress(10);

      logger.info('Warming session', {
        taskId,
        phone: acc.phone,
        day,
        sessionIndex: sessionIndex + 1,
        perDay,
        tier,
        mode: task.mode,
      });

      // Mark day start / executing
      const dayStartedAt = task.current_day_started_at
        ? new Date(task.current_day_started_at)
        : new Date();
      await warmingData.updateTask(taskId, {
        status: 'executing',
        current_day_started_at: dayStartedAt,
      });

      // Complete any pending reciprocal saves/replies where we are the "to" side
      try {
        await handshake.completePendingReciprocals(acc, { max: 3 });
      } catch (e) {
        logger.debug('Reciprocal batch skipped', { taskId, error: e.message });
      }

      await job.updateProgress(20);

      // Bootstrap session (session 0): profile
      if (sessionIndex === 0 || day === 0) {
        await behaviors.maybeApplyProfile(task.ws_account_id, acc, {
          force: sessionIndex === 0 && day === 0,
        });
      }

      await behaviors.runPresenceCycle(task.ws_account_id);
      await job.updateProgress(35);

      // Peer messaging with first-contact handshake
      const msgCount = peerMessageCount({
        tier,
        mode: task.mode,
        sessionIndex,
        isShortWarm,
      });

      let peerActions = 0;
      const dailyCap = isFast ? 12 : 8;
      const alreadySent = acc.daily_sent || 0;
      const remaining = Math.max(0, dailyCap - alreadySent);
      const effectiveCount = Math.min(msgCount, remaining);

      if (effectiveCount <= 0) {
        logger.warn('Warming: daily peer cap reached', { taskId, phone: acc.phone, dailyCap });
      } else {
        const peers = await warmingData.pickWarmingPeers(task.ws_account_id, {
          count: effectiveCount,
          preferUnintroduced: true,
        });

        if (!peers.length) {
          logger.warn('Warming: no peers — self-ping fallback', { taskId, phone: acc.phone });
          if (tier === 'light' || isShortWarm) {
            await behaviors.selfPing(task.ws_account_id);
          }
        } else {
          for (const peer of peers.slice(0, effectiveCount)) {
            const introduced = await warmingData.isPeerIntroduced(acc.id, peer.id);
            if (!introduced) {
              const result = await handshake.ensurePeerHandshake(acc, peer);
              if (result.ok || result.skipped) peerActions += 1;
            } else {
              const fu = await handshake.sendPeerFollowUp(acc, peer);
              if (fu.ok) peerActions += 1;
            }

            await db('ws_accounts')
              .where({ id: task.ws_account_id })
              .update({ daily_sent: db.raw('COALESCE(daily_sent, 0) + 1') })
              .catch(() => {});
          }
        }
      }

      await job.updateProgress(60);

      // Medium+: warm group
      if (tier === 'medium' || tier === 'active' || (isShortWarm && sessionIndex >= perDay - 1)) {
        await behaviors.maybeWarmGroup(task.ws_account_id, acc, {
          extra: tier === 'active' && isFast,
        });
      }

      // Active: audio note to an introduced peer
      if (tier === 'active' && peerActions > 0) {
        const peers = await warmingData.pickWarmingPeers(task.ws_account_id, {
          count: 1,
          preferUnintroduced: false,
        });
        if (peers[0]) {
          await behaviors.maybeSendAudioNote(task.ws_account_id, peers[0]);
        }
      }

      await job.updateProgress(80);

      // Advance session / day (use day start from beginning of this session)
      const advanced = advanceAfterSession({
        ...task,
        current_day_started_at: dayStartedAt,
      });
      await applyProgressAndMaybeReschedule(taskId, task, acc, advanced, job);

      await job.updateProgress(100);
      return {
        progress: advanced.progress_days,
        sessionsToday: advanced.sessions_completed_today,
        dayCompleted: advanced.dayCompleted,
        done: advanced.isDone,
        tier,
        peerActions,
      };
    },
    {
      connection: getConnection(),
      concurrency: 2,
      stalledInterval: 45000,
      maxStalledCount: 3,
    },
  );

  worker.on('failed', (job, err) => {
    logger.error('Warming job failed', {
      jobId: job?.id,
      taskId: job?.data?.taskId,
      err: err.message,
    });
  });

  worker.on('completed', (job) => {
    logger.debug('Warming job completed', { jobId: job.id });
  });

  logger.info('Warming worker started (calendar sessions + peer handshake)');
  return worker;
}

async function applyProgressAndMaybeReschedule(taskId, task, acc, advanced, job) {
  const session = buildSession();

  await warmingData.updateTask(taskId, {
    sessions_completed_today: advanced.sessions_completed_today,
    progress_days: advanced.progress_days,
    current_day_started_at: advanced.current_day_started_at,
    last_session_at: advanced.last_session_at,
    status: advanced.isDone ? 'completed' : 'executing',
    ...(advanced.isDone && { completed_at: db.fn.now() }),
  });

  // Health bump on successful session
  const currentScore = acc.health_score || 100;
  await db('ws_accounts').where({ id: task.ws_account_id }).update({
    health_score: Math.min(100, currentScore + 1),
  });

  if (advanced.isDone) {
    try {
      const gradNicks = await db('materials').where({ type: 'nickname' }).select('content');
      if (gradNicks.length) {
        const nick = gradNicks[Math.floor(Math.random() * gradNicks.length)].content;
        await session.updateProfile(task.ws_account_id, { name: nick }).catch(() => {});
      }
    } catch { /* ignore */ }

    await db('ws_accounts')
      .where({ id: task.ws_account_id })
      .update({
        status: 'active',
        current_warming_task_id: null,
        is_in_warehouse: false,
      });

    logger.info('Warming COMPLETED — graduated to active', {
      taskId,
      phone: acc.phone,
      days: advanced.progress_days,
    });
  } else {
    await scheduleWarmingTask(taskId, advanced.nextDelayMs);
    logger.info('Warming next session scheduled', {
      taskId,
      phone: acc.phone,
      delayMs: advanced.nextDelayMs,
      progressDays: advanced.progress_days,
      sessionsToday: advanced.sessions_completed_today,
      dayCompleted: advanced.dayCompleted,
    });
  }

  if (job) await job.updateProgress(90);
}

export default startWarmingWorker;
