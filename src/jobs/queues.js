/**
 * BullMQ queues for WA Control: warming, blasts, group pulls, exports.
 * Requires Redis running.
 */
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import config from '../config/index.js';
import { logger } from '../utils/logger.js';

const connection = new IORedis({
  host: config.REDIS_HOST || 'localhost',
  port: config.REDIS_PORT || 6379,
  password: config.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
});

connection.on('error', (e) => logger.error('Redis error (BullMQ)', e.message));

export const warmingQueue = new Queue('warming', { connection });
export const blastQueue = new Queue('blast', { connection });
export const groupPullQueue = new Queue('group-pull', { connection });
export const exportQueue = new Queue('export', { connection });

export const allQueues = [warmingQueue, blastQueue, groupPullQueue, exportQueue];

/**
 * Schedule a warming session (or day-finalize) job.
 * Unique job id per enqueue so repeated reschedules always work; reconciler
 * dedupes by scanning waiting/delayed jobs for the same taskId.
 */
export async function scheduleWarmingTask(taskId, delayMs = 0) {
  return warmingQueue.add(
    'execute-warm-step',
    { taskId },
    {
      delay: Math.max(0, delayMs || 0),
      removeOnComplete: 100,
      removeOnFail: 50,
      lockDuration: 120000, // 2 minutes - prevents premature stall during slow steps
      jobId: `warm-${taskId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    }
  );
}

/** True if task already has a waiting/delayed/active job in the warming queue. */
export async function hasPendingWarmingJob(taskId) {
  const states = ['waiting', 'delayed', 'active', 'prioritized', 'paused'];
  const jobs = await warmingQueue.getJobs(states, 0, 500);
  return jobs.some((j) => j?.data?.taskId === taskId);
}

/**
 * Re-queue executing/pending warming tasks that lost their delayed job (process restart).
 */
export async function reconcileWarmingJobs(listActiveTasksFn) {
  const tasks = typeof listActiveTasksFn === 'function'
    ? await listActiveTasksFn()
    : [];
  let scheduled = 0;
  for (const task of tasks) {
    if (!task?.id) continue;
    const has = await hasPendingWarmingJob(task.id);
    if (!has) {
      await scheduleWarmingTask(task.id, 3000);
      scheduled += 1;
      logger.info('Warming reconciler: re-scheduled task', { taskId: task.id });
    }
  }
  return { checked: tasks.length, scheduled };
}

export async function scheduleBlastJob(campaignId, delayMs = 0) {
  return blastQueue.add(
    'process-blast-campaign',
    { campaignId },
    { delay: delayMs, removeOnComplete: 50, removeOnFail: 20 }
  );
}

export async function scheduleGroupPullJob(pullId, delayMs = 0) {
  return groupPullQueue.add(
    'process-group-pull',
    { pullId },
    { delay: delayMs, removeOnComplete: 50, removeOnFail: 20 }
  );
}

export function getConnection() {
  return connection;
}

export async function closeQueues() {
  await Promise.all(allQueues.map((q) => q.close()));
  await connection.quit();
}

logger.info('BullMQ queues initialized');
