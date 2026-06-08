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

// Simple helper to schedule a warming execution job (repeatable or delayed)
// Use a generous lockDuration so long-running simulation steps don't cause "stalled" errors.
export async function scheduleWarmingTask(taskId, delayMs = 0) {
  return warmingQueue.add(
    'execute-warm-step',
    { taskId },
    {
      delay: delayMs,
      removeOnComplete: 100,
      removeOnFail: 50,
      lockDuration: 120000, // 2 minutes - prevents premature stall during slow steps
    }
  );
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
