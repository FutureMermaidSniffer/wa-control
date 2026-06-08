/**
 * Warming worker - executes 养号 steps on live sessions.
 * This is the heart of Phase 4.
 */
import { Worker } from 'bullmq';
import { getConnection } from '../queues.js';
import db from '../../db/connection.js';
import SessionManager from '../../core/sessions/SessionManager.js';
import { logger } from '../../utils/logger.js';
import warmingData from '../../data/warming.data.js';

const sessionManager = new SessionManager(db);

export function startWarmingWorker() {
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

      // Ensure account session
      try {
        await sessionManager.connectAccount(task.ws_account_id);
      } catch (e) {
        logger.warn('Failed to ensure session for warm', { taskId, error: e.message });
      }

      // Real(ish) behavior simulation start - Phase 4.2
      // Different intensity: normal = light, fast_warm = more actions + faster ramp (but still safe)
      const isFast = task.mode === 'fast_warm';
      const intensity = isFast ? 3 : 1; // actions per "day"

      await job.updateProgress(10); // signal that we are alive and processing

      const sock = await sessionManager.getOrCreateSocket(task.ws_account_id).catch(() => null);

      // 1. Profile updates (nick + avatar) - core for 养号
      try {
        const nicks = await db('materials').where({ type: 'nickname' }).select('content');
        if (nicks.length && sock) {
          const nick = nicks[Math.floor(Math.random() * nicks.length)].content;
          await sessionManager.updateProfile(task.ws_account_id, { name: nick }).catch(() => {});
          logger.info('Warming: applied nick', { taskId, nick: nick.slice(0,12) });
        }

        const avatars = await db('materials').where({ type: 'avatar' }).select('content');
        if (avatars.length && sock) {
          const avatarContent = avatars[Math.floor(Math.random() * avatars.length)].content;
          if (avatarContent && !avatarContent.startsWith('http')) {
            const avatarPath = avatarContent.startsWith('/') || avatarContent.startsWith('./')
              ? avatarContent
              : `./uploads/${avatarContent}`;
            await sessionManager.updateProfile(task.ws_account_id, { avatarBufferOrPath: avatarPath }).catch(() => {});
            logger.info('Warming: applied avatar', { taskId });
          }
        }
      } catch (e) { /* ignore */ }

      // 2. Light self-message (human-like activity)
      if (sock && sock.user && sock.user.id) {
        try {
          const selfJid = sock.user.id + '@s.whatsapp.net';
          await sessionManager.sendText(task.ws_account_id, selfJid, 'Warm ping ' + new Date().toISOString().slice(11,16), { delayMs: 800 });
        } catch (e) { /* may fail if not fully ready */ }
      }

      // 3. Simulate receiving / light interaction (if there are any test convos or always light)
      // For realism: update status message occasionally
      if (sock && Math.random() < 0.6 * intensity) {
        try {
          // Baileys has setStatus or presence; use a simple text status via profile if available, or skip
          // For now, another light send or presence
          await sock.sendPresenceUpdate('available').catch(() => {});
        } catch (e) {}
      }

      // 4. For fast_warm or later days: simulate joining a "warm group" slowly (placeholder - real 拉群 separate)
      if (isFast || (task.progress_days || 0) > 3) {
        if (sock && Math.random() < 0.4) {
          logger.info('Warming: simulated light group presence', { taskId });
          // In full impl: join a dedicated warm group using a helper number, send 1 msg, leave later
        }
      }

      await job.updateProgress(80);

      const newProgress = Math.min((task.progress_days || 0) + 1, task.target_days || 10);
      const isDone = newProgress >= (task.target_days || 10);

      await warmingData.updateTask(taskId, {
        progress_days: newProgress,
        status: isDone ? 'completed' : 'executing',
        ...(isDone && { completed_at: db.fn.now() }),
      });

      if (isDone) {
        // Completion / exit to active (4.3)
        // Apply a "graduation" profile if available (final polish)
        try {
          const gradNicks = await db('materials').where({ type: 'nickname' }).select('content');
          if (gradNicks.length) {
            const nick = gradNicks[Math.floor(Math.random() * gradNicks.length)].content + ' (已养成)';
            await sessionManager.updateProfile(task.ws_account_id, { name: nick }).catch(() => {});
          }
        } catch (e) {}

        await db('ws_accounts')
          .where({ id: task.ws_account_id })
          .update({ status: 'active', current_warming_task_id: null, is_in_warehouse: false });
        logger.info('Warming task completed for account - moved to active (graduation applied if possible)', { taskId });
      } else {
        // Re-schedule: realistic delays
        // Normal: ~hours (demo 2min), fast_warm: more frequent but still throttled (demo 45s)
        const delay = task.mode === 'fast_warm' ? 45 * 1000 : 120 * 1000;
        const { scheduleWarmingTask } = await import('../queues.js');
        await scheduleWarmingTask(taskId, delay);
      }

      return { progress: newProgress, done: isDone };
    },
    {
      connection: getConnection(),
      concurrency: 2,
      stalledInterval: 45000,   // check for stalled jobs less aggressively
      maxStalledCount: 3,       // allow a few stalls before giving up (useful in dev)
    }
  );

  worker.on('failed', (job, err) => {
    logger.error('Warming job failed', { jobId: job?.id, taskId: job?.data?.taskId, err: err.message });
  });

  logger.info('Warming worker started');
  return worker;
}

export default startWarmingWorker;
