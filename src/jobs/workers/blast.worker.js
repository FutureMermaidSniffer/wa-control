/**
 * Blast worker - processes mass-messaging campaigns.
 * Supports fan blasts and basic cold blasts with safety.
 */
import { Worker } from 'bullmq';
import { getConnection } from '../queues.js';
import db from '../../db/connection.js';
import blastsData from '../../data/blasts.data.js';
import SessionManager from '../../core/sessions/SessionManager.js';
import { logger } from '../../utils/logger.js';

const sessionManager = new SessionManager(db);

const DAILY_CAP = 100; // per number per day safety cap (configurable later)

export function startBlastWorker() {
  const worker = new Worker(
    'blast',
    async (job) => {
      const { campaignId } = job.data;
      logger.info('Blast job started', { campaignId, jobId: job.id });

      const campaign = await blastsData.getCampaign(campaignId);
      if (!campaign || !['running', 'scheduled'].includes(campaign.status)) {
        logger.info('Skipping blast campaign', { campaignId, status: campaign?.status });
        return { skipped: true };
      }

      await blastsData.updateCampaign(campaignId, { status: 'running', started_at: db.fn.now() });

      const recipients = await blastsData.listRecipients(campaignId, { status: 'pending' });
      let sent = 0;
      let failed = 0;

      for (const recip of recipients) {
        try {
          // Simple daily cap check (per ws_account)
          const today = new Date().toISOString().slice(0, 10);
          const sentToday = await db('blast_recipients')
            .where({ ws_account_id: recip.ws_account_id, status: 'sent' })
            .whereRaw("DATE(sent_at) = ?", [today])
            .count('* as count')
            .first();

          if (parseInt(sentToday.count) >= DAILY_CAP) {
            await blastsData.updateRecipient(recip.id, { status: 'skipped', error: 'daily cap reached' });
            continue;
          }

          // Send via live session
          const toJid = recip.phone.includes('@') ? recip.phone : `${recip.phone}@s.whatsapp.net`;
          await sessionManager.sendText(recip.ws_account_id, toJid, campaign.message_template, { delayMs: 800 + Math.random() * 1500 });

          await blastsData.updateRecipient(recip.id, {
            status: 'sent',
            sent_at: db.fn.now(),
          });
          sent++;

          // Small delay between sends for safety
          await new Promise(r => setTimeout(r, 1500));

        } catch (e) {
          logger.warn('Blast recipient failed', { recipient: recip.id, error: e.message });
          await blastsData.updateRecipient(recip.id, { status: 'failed', error: e.message });
          failed++;
        }
      }

      const finalStats = await blastsData.countRecipientsByStatus(campaignId);
      const allDone = finalStats.pending === 0;

      await blastsData.updateCampaign(campaignId, {
        status: allDone ? 'completed' : 'running',
        stats: finalStats,
        ...(allDone && { completed_at: db.fn.now() }),
      });

      logger.info('Blast campaign progress', { campaignId, sent, failed, stats: finalStats });

      if (!allDone) {
        // Re-queue for more recipients if any left (demo: small delay)
        await (await import('../queues.js')).scheduleBlastJob(campaignId, 5000);
      }

      return { sent, failed, done: allDone };
    },
    { connection: getConnection(), concurrency: 1 }
  );

  worker.on('failed', (job, err) => {
    logger.error('Blast job failed', { jobId: job?.id, campaignId: job?.data?.campaignId, err: err.message });
  });

  logger.info('Blast worker started');
  return worker;
}

export default startBlastWorker;