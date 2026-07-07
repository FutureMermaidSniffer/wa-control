/**
 * Warming worker — peer-warming engine.
 *
 * Key principle: numbers warm EACH OTHER.
 * - Accounts in the warming pool send real messages to other pool members (peers).
 * - Uses day-range tiers: light (1-3), medium (4-7), active (8+).
 * - Audio warmth: sends voice note placeholders (file from materials if available).
 * - Warm group: all pool members share a WA group and message it.
 * - Safety monitor: health_score gating + daily cap + global ban detection.
 */
import { Worker } from 'bullmq';
import { getConnection } from '../queues.js';
import db from '../../db/connection.js';
import SessionManager from '../../core/sessions/SessionManager.js';
import { logger } from '../../utils/logger.js';
import warmingData from '../../data/warming.data.js';

const sessionManager = new SessionManager(db);

// Utility: random int in [min, max]
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// Async sleep
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// --- Warm peer messages pool ---
const PEER_TEXTS = [
  'Hey! 👋', 'How are you doing?', 'Good morning! ☀️', 'Just checking in 😊',
  '🙌', 'Hey, what\'s up?', 'Hi there!', 'Hope you\'re having a good day!',
  'Hey! 🙂', 'Checking in!', '👍', '😄', 'Hope all is well!', 'Hello!',
];

// --- Warm group messages pool ---
const GROUP_TEXTS = [
  'Good morning everyone! 🌅', 'Have a great day! 💪', 'Hey team! 👋',
  '🌟', 'Hope everyone is doing well!', 'Rise and shine! ☀️',
  'Happy to be here 😊', 'Hello all!', '🙌🙌', 'Have a productive day!',
];

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

      // === Safety pre-check ===
      const acc = await db('ws_accounts').where({ id: task.ws_account_id }).first();
      if (!acc) throw new Error(`ws_account ${task.ws_account_id} not found`);

      // Health gate: if health_score is too low, pause this account
      if ((acc.health_score || 100) < 30) {
        logger.warn('Warming paused: health_score too low', { taskId, phone: acc.phone, score: acc.health_score });
        await warmingData.updateTask(taskId, { status: 'paused' });
        return { skipped: true, reason: 'health_score_too_low' };
      }

      // Global ban signal: if > 5 accounts errored in last hour, pause all
      const recentErrors = await db('ws_accounts')
        .where('status', 'error')
        .where('updated_at', '>', db.raw("NOW() - INTERVAL '1 hour'"))
        .count('id as n')
        .first();
      if (parseInt(recentErrors?.n || 0) > 5) {
        logger.error('GLOBAL BAN SIGNAL: many accounts errored in last hour — pausing warming', { taskId });
        await warmingData.updateTask(taskId, { status: 'paused' });
        return { skipped: true, reason: 'global_ban_signal' };
      }

      // Ensure account session
      try {
        await sessionManager.connectAccount(task.ws_account_id);
      } catch (e) {
        logger.warn('Failed to ensure session for warm', { taskId, error: e.message });
      }

      await job.updateProgress(10);

      const sock = await sessionManager.getOrCreateSocket(task.ws_account_id).catch(() => null);
      const isFast = task.mode === 'fast_warm';
      const day = task.progress_days || 0;

      // Day-range tier
      const tier = day < 3 ? 'light' : (day < 7 ? 'medium' : 'active');
      logger.info('Warming tier', { taskId, phone: acc.phone, day, tier, isFast });

      // === TIER 1 — LIGHT (day 0-2): profile + presence + self-ping ===
      // Profile: apply once (check if already done today via a simple time guard)
      const lastProfileUpdate = acc.updated_at ? new Date(acc.updated_at) : new Date(0);
      const hoursSinceProfile = (Date.now() - lastProfileUpdate.getTime()) / 3_600_000;

      if (hoursSinceProfile > 47 || day === 0) {
        // Nickname from materials
        try {
          const nicks = await db('materials').where({ type: 'nickname' }).select('content');
          if (nicks.length && sock) {
            const nick = nicks[rand(0, nicks.length - 1)].content;
            await sessionManager.updateProfile(task.ws_account_id, { name: nick }).catch(() => {});
            logger.info('Warming: applied nickname', { taskId, nick: nick.slice(0, 12) });
            await sleep(rand(1500, 3000));
          }
        } catch (e) { /* ignore */ }

        // Avatar from materials
        try {
          const avatars = await db('materials').where({ type: 'avatar' }).select('content');
          if (avatars.length && sock) {
            const avatarContent = avatars[rand(0, avatars.length - 1)].content;
            if (avatarContent && !avatarContent.startsWith('http')) {
              const avatarPath = avatarContent.startsWith('/') || avatarContent.startsWith('./')
                ? avatarContent : `./uploads/${avatarContent}`;
              await sessionManager.updateProfile(task.ws_account_id, { avatarBufferOrPath: avatarPath }).catch(() => {});
              logger.info('Warming: applied avatar', { taskId });
              await sleep(rand(2000, 4000));
            }
          }
        } catch (e) { /* ignore */ }
      }

      // Presence ping (available → composing → unavailable)
      if (sock) {
        await sock.sendPresenceUpdate('available').catch(() => {});
        await sleep(rand(3000, 8000));
        await sock.sendPresenceUpdate('unavailable').catch(() => {});
        logger.info('Warming: presence update', { taskId });
      }

      // Self-message (every run on light tier)
      if (sock && sock.user?.id) {
        try {
          const selfJid = `${sock.user.id.split(':')[0]}@s.whatsapp.net`;
          await sessionManager.sendText(task.ws_account_id, selfJid,
            `Warm check ${new Date().toISOString().slice(11, 16)}`, { delayMs: rand(500, 1500) });
          logger.info('Warming: self-message sent', { taskId });
        } catch (e) { /* may fail if not fully online */ }
      }

      await job.updateProgress(35);

      // === TIER 2 — MEDIUM (day 3-6): peer messaging + warm group ===
      if ((tier === 'medium' || tier === 'active') && sock) {

        // --- PEER MESSAGING: find other accounts currently in the warming pool ---
        try {
          const peers = await db('warming_tasks')
            .join('ws_accounts', 'warming_tasks.ws_account_id', 'ws_accounts.id')
            .whereIn('warming_tasks.status', ['executing', 'pending'])
            .whereNot('warming_tasks.ws_account_id', task.ws_account_id)
            .select('ws_accounts.id', 'ws_accounts.phone', 'ws_accounts.jid')
            .limit(5);

          if (peers.length) {
            // Pick 1-2 random peers to message
            const shuffled = peers.sort(() => Math.random() - 0.5).slice(0, isFast ? 2 : 1);
            for (const peer of shuffled) {
              const peerJid = peer.jid ||
                `${peer.phone.replace(/[^\d]/g, '')}@s.whatsapp.net`;
              const msg = PEER_TEXTS[rand(0, PEER_TEXTS.length - 1)];
              await sessionManager.sendText(task.ws_account_id, peerJid, msg, { delayMs: rand(2000, 6000) });
              logger.info('Warming: peer message sent', { taskId, from: acc.phone, to: peer.phone, msg });
              await sleep(rand(4000, 12000)); // human-like gap between peer messages
            }
          }
        } catch (e) {
          logger.warn('Warming: peer messaging failed (non-critical)', { taskId, error: e.message });
        }

        // --- WARM GROUP: send to shared warm group if assigned ---
        try {
          if (acc.warm_group_id || acc.current_warming_task_id) {
            // Check if there's a warm_groups entry matching
            const warmGroup = await db('warm_groups')
              .where('id', acc.warm_group_id || '')
              .orWhereRaw("member_account_ids @> ?", [JSON.stringify([task.ws_account_id])])
              .first();

            if (warmGroup?.group_jid) {
              const groupMsg = GROUP_TEXTS[rand(0, GROUP_TEXTS.length - 1)];
              await sessionManager.sendText(task.ws_account_id, warmGroup.group_jid, groupMsg, { delayMs: rand(1000, 3000) });
              logger.info('Warming: warm group message sent', { taskId, groupJid: warmGroup.group_jid });
            }
          }
        } catch (e) {
          // warm_groups table might not exist yet — non-fatal
          logger.debug('Warming: warm group send skipped', { taskId, error: e.message });
        }
      }

      await job.updateProgress(60);

      // === TIER 3 — ACTIVE (day 7+): replies + audio note + more group activity ===
      if (tier === 'active' && sock) {

        // Simulate composing presence before next message (human-like)
        if (sock.user?.id) {
          try {
            const selfJid = `${sock.user.id.split(':')[0]}@s.whatsapp.net`;
            await sock.sendPresenceUpdate('composing', selfJid).catch(() => {});
            await sleep(rand(1500, 4000));
            await sock.sendPresenceUpdate('paused', selfJid).catch(() => {});
          } catch (e) { /* ignore */ }
        }

        // Audio note: look for audio material in materials library
        // Materials can have type='audio' pointing to an .ogg/.opus file in /uploads
        try {
          const audioMats = await db('materials').where({ type: 'audio' }).select('content').limit(5);
          if (audioMats.length && sock && sock.user?.id) {
            const audioMat = audioMats[rand(0, audioMats.length - 1)];
            const audioPath = audioMat.content.startsWith('/')
              ? audioMat.content : `./uploads/${audioMat.content}`;

            const { default: fs } = await import('fs/promises');
            const audioBuf = await fs.readFile(audioPath).catch(() => null);
            if (audioBuf) {
              const peers = await db('warming_tasks')
                .join('ws_accounts', 'warming_tasks.ws_account_id', 'ws_accounts.id')
                .whereIn('warming_tasks.status', ['executing', 'pending'])
                .whereNot('warming_tasks.ws_account_id', task.ws_account_id)
                .select('ws_accounts.id', 'ws_accounts.phone', 'ws_accounts.jid')
                .limit(3);

              if (peers.length) {
                const peer = peers[rand(0, peers.length - 1)];
                const peerJid = peer.jid || `${peer.phone.replace(/[^\d]/g, '')}@s.whatsapp.net`;
                await sock.sendMessage(peerJid, {
                  audio: audioBuf,
                  mimetype: 'audio/ogg; codecs=opus',
                  ptt: true, // voice note (push-to-talk)
                });
                logger.info('Warming: audio note sent to peer', { taskId, to: peer.phone });
              }
            }
          }
        } catch (e) {
          logger.debug('Warming: audio note skipped', { taskId, error: e.message });
        }

        // Extra group activity on fast warm
        if (isFast) {
          try {
            const warmGroup = await db('warm_groups')
              .whereRaw("member_account_ids @> ?", [JSON.stringify([task.ws_account_id])])
              .first().catch(() => null);
            if (warmGroup?.group_jid) {
              const msg2 = GROUP_TEXTS[rand(0, GROUP_TEXTS.length - 1)];
              await sessionManager.sendText(task.ws_account_id, warmGroup.group_jid, msg2, { delayMs: rand(5000, 15000) });
            }
          } catch (e) { /* ignore */ }
        }
      }

      await job.updateProgress(80);

      // === Progress advance ===
      const newProgress = Math.min((task.progress_days || 0) + 1, task.target_days || 10);
      const isDone = newProgress >= (task.target_days || 10);

      await warmingData.updateTask(taskId, {
        progress_days: newProgress,
        status: isDone ? 'completed' : 'executing',
        ...(isDone && { completed_at: db.fn.now() }),
      });

      // Update health score (increment slightly on successful run)
      const currentScore = acc.health_score || 100;
      await db('ws_accounts').where({ id: task.ws_account_id }).update({
        health_score: Math.min(100, currentScore + 2),
      });

      if (isDone) {
        // Graduation: apply a fresh nickname/avatar and move to active
        try {
          const gradNicks = await db('materials').where({ type: 'nickname' }).select('content');
          if (gradNicks.length) {
            const nick = gradNicks[rand(0, gradNicks.length - 1)].content;
            await sessionManager.updateProfile(task.ws_account_id, { name: nick }).catch(() => {});
          }
        } catch (e) { /* ignore */ }

        await db('ws_accounts')
          .where({ id: task.ws_account_id })
          .update({ status: 'active', current_warming_task_id: null, is_in_warehouse: false });

        logger.info('Warming COMPLETED — account graduated to active', { taskId, phone: acc.phone });
      } else {
        // Re-schedule next cycle with human-like delay
        // Normal: 2h (demo: 2 min). Fast warm: 45 min (demo: 45 s).
        const delay = isFast ? 45_000 : 120_000;
        const { scheduleWarmingTask } = await import('../queues.js');
        await scheduleWarmingTask(taskId, delay);
      }

      await job.updateProgress(100);
      return { progress: newProgress, done: isDone, tier };
    },
    {
      connection: getConnection(),
      concurrency: 2,
      stalledInterval: 45000,
      maxStalledCount: 3,
    }
  );

  worker.on('failed', (job, err) => {
    logger.error('Warming job failed', { jobId: job?.id, taskId: job?.data?.taskId, err: err.message });
  });

  worker.on('completed', (job) => {
    logger.debug('Warming job completed', { jobId: job.id });
  });

  logger.info('Warming worker started (peer-warming mode)');
  return worker;
}

export default startWarmingWorker;
