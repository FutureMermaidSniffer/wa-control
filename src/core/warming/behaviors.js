/**
 * Warming session behavior building blocks (profile, presence, group, audio).
 */
import db from '../../db/connection.js';
import { logger } from '../../utils/logger.js';

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const GROUP_TEXTS = [
  'Good morning everyone! 🌅', 'Have a great day! 💪', 'Hey team! 👋',
  '🌟', 'Hope everyone is doing well!', 'Rise and shine! ☀️',
  'Happy to be here 😊', 'Hello all!', '🙌🙌', 'Have a productive day!',
];

/**
 * @param {{ updateProfile: Function, sendText: Function, getOrCreateSocket: Function }} session
 */
export function createBehaviors(session) {
  async function maybeApplyProfile(accountId, account, { force = false } = {}) {
    const lastProfileUpdate = account.updated_at ? new Date(account.updated_at) : new Date(0);
    const hoursSinceProfile = (Date.now() - lastProfileUpdate.getTime()) / 3_600_000;
    if (!force && hoursSinceProfile <= 47) return { applied: false };

    const sock = await session.getOrCreateSocket(accountId).catch(() => null);
    if (!sock) return { applied: false, reason: 'no_socket' };

    let applied = false;
    try {
      const nicks = await db('materials').where({ type: 'nickname' }).select('content');
      if (nicks.length) {
        const nick = nicks[rand(0, nicks.length - 1)].content;
        await session.updateProfile(accountId, { name: nick }).catch(() => {});
        logger.info('Warming: applied nickname', { accountId, nick: nick.slice(0, 12) });
        applied = true;
        await sleep(rand(1500, 3000));
      }
    } catch { /* ignore */ }

    try {
      const avatars = await db('materials').where({ type: 'avatar' }).select('content');
      if (avatars.length) {
        const avatarContent = avatars[rand(0, avatars.length - 1)].content;
        if (avatarContent && !avatarContent.startsWith('http')) {
          const avatarPath = avatarContent.startsWith('/') || avatarContent.startsWith('./')
            ? avatarContent
            : `./uploads/${avatarContent}`;
          await session.updateProfile(accountId, { avatarBufferOrPath: avatarPath }).catch(() => {});
          logger.info('Warming: applied avatar', { accountId });
          applied = true;
          await sleep(rand(2000, 4000));
        }
      }
    } catch { /* ignore */ }

    return { applied };
  }

  async function runPresenceCycle(accountId) {
    const sock = await session.getOrCreateSocket(accountId).catch(() => null);
    if (!sock) return { ok: false };
    try {
      await sock.sendPresenceUpdate('available').catch(() => {});
      await sleep(rand(3000, 8000));
      await sock.sendPresenceUpdate('unavailable').catch(() => {});
      logger.info('Warming: presence update', { accountId });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async function maybeWarmGroup(accountId, account, { extra = false } = {}) {
    try {
      const warmGroup = await db('warm_groups')
        .where('id', account.warm_group_id || '')
        .orWhereRaw('member_account_ids @> ?', [JSON.stringify([accountId])])
        .first()
        .catch(() => null);

      if (!warmGroup?.group_jid) return { sent: false };

      const msg = GROUP_TEXTS[rand(0, GROUP_TEXTS.length - 1)];
      await session.sendText(accountId, warmGroup.group_jid, msg, { delayMs: rand(1000, 3000) });
      logger.info('Warming: warm group message sent', { accountId, groupJid: warmGroup.group_jid });

      if (extra) {
        await sleep(rand(5000, 15000));
        const msg2 = GROUP_TEXTS[rand(0, GROUP_TEXTS.length - 1)];
        await session.sendText(accountId, warmGroup.group_jid, msg2, { delayMs: rand(500, 2000) });
      }
      return { sent: true };
    } catch (e) {
      logger.debug('Warming: warm group send skipped', { accountId, error: e.message });
      return { sent: false, error: e.message };
    }
  }

  async function maybeSendAudioNote(accountId, peer) {
    try {
      const audioMats = await db('materials').where({ type: 'audio' }).select('content').limit(5);
      if (!audioMats.length || !peer?.phone) return { sent: false };

      const audioMat = audioMats[rand(0, audioMats.length - 1)];
      const audioPath = audioMat.content.startsWith('/')
        ? audioMat.content
        : `./uploads/${audioMat.content}`;

      const { default: fs } = await import('fs/promises');
      const audioBuf = await fs.readFile(audioPath).catch(() => null);
      if (!audioBuf) return { sent: false };

      const sock = await session.getOrCreateSocket(accountId).catch(() => null);
      if (!sock) return { sent: false };

      const digits = String(peer.phone || '').replace(/\D/g, '');
      const peerJid = `${digits}@s.whatsapp.net`;
      await sock.sendMessage(peerJid, {
        audio: audioBuf,
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true,
      });
      logger.info('Warming: audio note sent to peer', { accountId, to: peer.phone });
      return { sent: true };
    } catch (e) {
      logger.debug('Warming: audio note skipped', { accountId, error: e.message });
      return { sent: false };
    }
  }

  async function selfPing(accountId) {
    try {
      const sock = await session.getOrCreateSocket(accountId).catch(() => null);
      if (!sock?.user?.id) return { sent: false };
      const selfJid = `${sock.user.id.split(':')[0]}@s.whatsapp.net`;
      await session.sendText(
        accountId,
        selfJid,
        `Warm check ${new Date().toISOString().slice(11, 16)}`,
        { delayMs: rand(500, 1500) },
      );
      logger.info('Warming: self-message (no peers) sent', { accountId });
      return { sent: true };
    } catch {
      return { sent: false };
    }
  }

  return {
    maybeApplyProfile,
    runPresenceCycle,
    maybeWarmGroup,
    maybeSendAudioNote,
    selfPing,
  };
}

export default createBehaviors;
