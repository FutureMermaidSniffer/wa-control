/**
 * Warming session behavior building blocks (profile, presence, group, audio).
 * Profile nick/avatar/about come from the default profile pool when populated.
 */
import db from '../../db/connection.js';
import { logger } from '../../utils/logger.js';
import profilePoolsData from '../../data/profilePools.data.js';
import materialsData from '../../data/materials.data.js';

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
  async function maybeApplyProfile(accountId, account, { force = false, poolId = null } = {}) {
    const lastProfileUpdate = account.updated_at ? new Date(account.updated_at) : new Date(0);
    const hoursSinceProfile = (Date.now() - lastProfileUpdate.getTime()) / 3_600_000;
    if (!force && hoursSinceProfile <= 47) return { applied: false };

    const sock = await session.getOrCreateSocket(accountId).catch(() => null);
    if (!sock) return { applied: false, reason: 'no_socket' };

    let applied = false;
    const appliedIds = {};

    try {
      const { materials: nicks, poolId: srcPool, source } = await profilePoolsData.pickMaterialsForWarming(
        'nickname',
        { poolId },
      );
      const nickMat = profilePoolsData.pickRandom(nicks);
      if (nickMat?.content) {
        await session.updateProfile(accountId, { name: nickMat.content }).catch(() => {});
        await materialsData.bumpUsage(nickMat.id);
        appliedIds.nickname = nickMat.id;
        logger.info('Warming: applied nickname', {
          accountId,
          nick: String(nickMat.content).slice(0, 12),
          source,
          poolId: srcPool,
        });
        applied = true;
        await sleep(rand(1500, 3000));
      }
    } catch (e) {
      logger.debug('Warming: nickname apply failed', { error: e.message });
    }

    try {
      const { materials: avatars, poolId: srcPool, source } = await profilePoolsData.pickMaterialsForWarming(
        'avatar',
        { poolId },
      );
      const avMat = profilePoolsData.pickRandom(avatars);
      const avatarContent = avMat?.content;
      if (avatarContent && !String(avatarContent).startsWith('http')) {
        const avatarPath = avatarContent.startsWith('/') || avatarContent.startsWith('./')
          ? avatarContent
          : `./uploads/${avatarContent}`;
        await session.updateProfile(accountId, { avatarBufferOrPath: avatarPath }).catch(() => {});
        await materialsData.bumpUsage(avMat.id);
        appliedIds.avatar = avMat.id;
        logger.info('Warming: applied avatar', { accountId, source, poolId: srcPool });
        applied = true;
        await sleep(rand(2000, 4000));
      }
    } catch (e) {
      logger.debug('Warming: avatar apply failed', { error: e.message });
    }

    try {
      const { materials: abouts, poolId: srcPool, source } = await profilePoolsData.pickMaterialsForWarming(
        'about',
        { poolId },
      );
      const aboutMat = profilePoolsData.pickRandom(abouts);
      if (aboutMat?.content) {
        await session.updateProfile(accountId, { status: aboutMat.content }).catch(() => {});
        await materialsData.bumpUsage(aboutMat.id);
        appliedIds.about = aboutMat.id;
        logger.info('Warming: applied about/status', {
          accountId,
          source,
          poolId: srcPool,
          text: String(aboutMat.content).slice(0, 24),
        });
        applied = true;
        await sleep(rand(1000, 2000));
      }
    } catch (e) {
      logger.debug('Warming: about apply failed', { error: e.message });
    }

    return { applied, appliedIds };
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
      const { materials: audioMats } = await profilePoolsData.pickMaterialsForWarming('audio');
      if (!audioMats.length || !peer?.phone) return { sent: false };

      const audioMat = audioMats[rand(0, audioMats.length - 1)];
      if (!audioMat?.content) return { sent: false };
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
