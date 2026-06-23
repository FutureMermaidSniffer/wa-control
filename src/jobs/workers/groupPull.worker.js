/**
 * Group Pull worker (background execution).
 * Handles the "adding members" phase after group creation + invite generation.
 * Uses the groupPullQueue.
 */
import { Worker } from 'bullmq';
import { getConnection, scheduleGroupPullJob } from '../queues.js';
import db from '../../db/connection.js';
import groupPullsData from '../../data/groupPulls.data.js';
import SessionManager from '../../core/sessions/SessionManager.js';
import { logger } from '../../utils/logger.js';

const sessionManager = new SessionManager(db);

export function startGroupPullWorker() {
  const worker = new Worker(
    'group-pull',
    async (job) => {
      const { pullId } = job.data;
      logger.info('GroupPull job started', { pullId, jobId: job.id });

      const pull = await groupPullsData.getGroupPull(pullId);
      if (!pull) {
        logger.warn('Group pull not found for job', { pullId });
        return { skipped: true };
      }

      if (!pull.created_group_jid) {
        logger.info('Group pull has no groupJid yet — waiting for execute to create it', { pullId });
        return { skipped: 'no-group' };
      }

      if (['completed', 'failed'].includes(pull.status)) {
        return { skipped: pull.status };
      }

      const targets = Array.isArray(pull.target_contacts) ? pull.target_contacts : [];
      if (!targets.length) {
        await groupPullsData.markCompleted(pullId);
        return { done: true, reason: 'no-targets' };
      }

      // For MVP: attempt to add all listed targets (Baileys will skip duplicates / already members)
      // In a more advanced version we would track per-member state in a join table.
      let addedThisRun = 0;
      try {
        await sessionManager.connectAccount(pull.admin_ws_account_id).catch(() => {});
        const result = await sessionManager.addParticipantsToGroup(
          pull.admin_ws_account_id,
          pull.created_group_jid,
          targets
        );
        // result shape from Baileys is usually { [jid]: { statusCode, ... } }
        const attempted = targets.length;
        addedThisRun = attempted; // optimistic; real success count can be parsed from result if needed
        await groupPullsData.incrementAdded(pullId, addedThisRun);

        logger.info('GroupPull add attempt', { pullId, attempted, resultSummary: typeof result === 'object' ? Object.keys(result).length : result });
      } catch (e) {
        logger.warn('GroupPull add failed in worker', { pullId, error: e.message });
        // do not mark failed — supervisor can retry via /add-members
      }

      const updated = await groupPullsData.getGroupPull(pullId);
      const targetGoal = pull.target_count || (targets.length);
      const isDone = (updated?.added_count || 0) >= targetGoal || targets.length === 0;

      if (isDone) {
        await groupPullsData.markCompleted(pullId);
        logger.info('Group pull completed', { pullId });
      } else {
        // Re-schedule a follow-up (demo pacing)
        await scheduleGroupPullJob(pullId, 8000);
      }

      return { added: addedThisRun, done: isDone };
    },
    { connection: getConnection(), concurrency: 1 }
  );

  worker.on('failed', (job, err) => {
    logger.error('GroupPull job failed', { jobId: job?.id, pullId: job?.data?.pullId, err: err.message });
  });

  logger.info('GroupPull worker started');
  return worker;
}

export default startGroupPullWorker;
