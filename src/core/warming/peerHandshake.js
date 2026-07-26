/**
 * First-message longevity handshake between warming peers.
 * Saves the peer as a WA contact (saveOnPrimaryAddressbook) before first text,
 * then tracks reciprocal save + reply.
 */
import { logger } from '../../utils/logger.js';
import warmingData from '../../data/warming.data.js';

const PEER_TEXTS = [
  'Hey! 👋', 'How are you doing?', 'Good morning! ☀️', 'Just checking in 😊',
  '🙌', 'Hey, what\'s up?', 'Hi there!', 'Hope you\'re having a good day!',
  'Hey! 🙂', 'Checking in!', '👍', '😄', 'Hope all is well!', 'Hello!',
];

const REPLY_TEXTS = [
  'Hey! Doing well 😊', 'Hi! All good here', 'Hey there 👋', 'Good to hear from you!',
  'Hi! 👍', 'Hey, same here!', 'Hello! 😄',
];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function displayNameFor(account) {
  return (account.display_name || account.phone || 'Contact').toString().slice(0, 40);
}

function phoneDigits(phone) {
  return String(phone || '').replace(/\D/g, '');
}

/**
 * @param {object} deps
 * @param {{ saveContact: Function, sendText: Function, getOrCreateSocket: Function, isSocketLive?: Function }} deps.session
 */
export function createPeerHandshake(deps) {
  const { session } = deps;

  /**
   * Ensure A has saved B, B saved A (if online), A sent first msg, B replies if live.
   * Safe to call repeatedly — no-ops when already introduced.
   */
  async function ensurePeerHandshake(fromAcc, toAcc, opts = {}) {
    if (!fromAcc?.id || !toAcc?.id || fromAcc.id === toAcc.id) {
      return { skipped: true, reason: 'invalid_pair' };
    }

    let link = await warmingData.getPeerLink(fromAcc.id, toAcc.id);
    if (link?.status === 'introduced' && link.first_message_at) {
      // Already introduced — caller may still send a casual follow-up
      return { skipped: true, reason: 'already_introduced', link };
    }

    if (!link) {
      link = await warmingData.upsertPeerLink({
        from_account_id: fromAcc.id,
        to_account_id: toAcc.id,
        status: 'pending',
      });
    }

    const peerDigits = phoneDigits(toAcc.phone);
    if (peerDigits.length < 8) {
      await warmingData.updatePeerLink(link.id, {
        status: 'failed',
        last_error: 'invalid peer phone',
        retry_count: (link.retry_count || 0) + 1,
      });
      return { ok: false, reason: 'invalid_phone', link };
    }
    const peerJid = `${peerDigits}@s.whatsapp.net`;
    const fromName = displayNameFor(fromAcc);
    const toName = displayNameFor(toAcc);

    // 1) A saves B
    let fromSaved = !!link.from_saved_at;
    if (!fromSaved) {
      try {
        await session.saveContact(fromAcc.id, peerJid, {
          fullName: toName,
          firstName: toName,
          saveOnPrimary: true,
        });
        fromSaved = true;
        await warmingData.updatePeerLink(link.id, { from_saved_at: new Date() });
        logger.info('Warming handshake: from saved peer', {
          from: fromAcc.phone, to: toAcc.phone,
        });
        await sleep(rand(400, 1200));
      } catch (e) {
        logger.warn('Warming handshake: saveContact(from→to) failed', {
          from: fromAcc.phone, to: toAcc.phone, error: e.message,
        });
        await warmingData.updatePeerLink(link.id, {
          last_error: e.message,
          retry_count: (link.retry_count || 0) + 1,
          status: (link.retry_count || 0) + 1 >= 5 ? 'failed' : 'pending',
        });
        // continue to message if allowed
        if (opts.requireSave) {
          return { ok: false, reason: 'save_failed', error: e.message, link };
        }
      }
    }

    // 2) B saves A if B session available
    let toSaved = !!link.to_saved_at;
    if (!toSaved) {
      const bLive = session.isSocketLive?.(toAcc.id);
      try {
        if (bLive || opts.forceReciprocalConnect) {
          if (!bLive && opts.forceReciprocalConnect) {
            await session.getOrCreateSocket?.(toAcc.id).catch(() => null);
          }
          const fromJid = `${phoneDigits(fromAcc.phone)}@s.whatsapp.net`;
          await session.saveContact(toAcc.id, fromJid, {
            fullName: fromName,
            firstName: fromName,
            saveOnPrimary: true,
          });
          toSaved = true;
          await warmingData.updatePeerLink(link.id, { to_saved_at: new Date() });
          logger.info('Warming handshake: to saved from (reciprocal)', {
            from: fromAcc.phone, to: toAcc.phone,
          });
          await sleep(rand(400, 1200));
        }
      } catch (e) {
        logger.warn('Warming handshake: reciprocal save failed (will retry later)', {
          from: fromAcc.phone, to: toAcc.phone, error: e.message,
        });
      }
    }

    // 3) First message A → B
    let firstMsg = !!link.first_message_at;
    if (!firstMsg) {
      try {
        const sock = await session.getOrCreateSocket(fromAcc.id).catch(() => null);
        if (sock) {
          await sock.sendPresenceUpdate?.('composing', peerJid).catch(() => {});
          await sleep(rand(800, 2500));
          await sock.sendPresenceUpdate?.('paused', peerJid).catch(() => {});
        }
        const msg = opts.introText || PEER_TEXTS[rand(0, PEER_TEXTS.length - 1)];
        await session.sendText(fromAcc.id, peerJid, msg, { delayMs: rand(300, 1500) });
        firstMsg = true;
        await warmingData.updatePeerLink(link.id, {
          first_message_at: new Date(),
          status: toSaved ? 'introduced' : 'pending',
        });
        logger.info('Warming handshake: first message sent', {
          from: fromAcc.phone, to: toAcc.phone, msg,
        });
      } catch (e) {
        logger.warn('Warming handshake: first message failed', {
          from: fromAcc.phone, to: toAcc.phone, error: e.message,
        });
        await warmingData.updatePeerLink(link.id, {
          last_error: e.message,
          retry_count: (link.retry_count || 0) + 1,
          status: 'failed',
        });
        return { ok: false, reason: 'message_failed', error: e.message, link };
      }
    }

    // 4) Reciprocal reply B → A if B live
    let reciprocal = !!link.reciprocal_message_at;
    if (!reciprocal) {
      const bLive = session.isSocketLive?.(toAcc.id);
      if (bLive || opts.forceReciprocalConnect) {
        try {
          if (!bLive) await session.getOrCreateSocket?.(toAcc.id).catch(() => null);
          const fromJid = `${phoneDigits(fromAcc.phone)}@s.whatsapp.net`;
          await sleep(rand(2000, 6000));
          const reply = REPLY_TEXTS[rand(0, REPLY_TEXTS.length - 1)];
          await session.sendText(toAcc.id, fromJid, reply, { delayMs: rand(500, 2000) });
          reciprocal = true;
          await warmingData.updatePeerLink(link.id, {
            reciprocal_message_at: new Date(),
            to_saved_at: toSaved ? (link.to_saved_at || new Date()) : undefined,
            status: 'introduced',
          });
          logger.info('Warming handshake: reciprocal reply sent', {
            from: fromAcc.phone, to: toAcc.phone,
          });
        } catch (e) {
          logger.debug('Warming handshake: reciprocal reply deferred', {
            from: fromAcc.phone, to: toAcc.phone, error: e.message,
          });
        }
      }
    }

    const updated = await warmingData.getPeerLink(fromAcc.id, toAcc.id);
    if (fromSaved && firstMsg && (toSaved || reciprocal)) {
      if (updated?.status !== 'introduced') {
        await warmingData.updatePeerLink(updated.id, { status: 'introduced' });
      }
    }

    return {
      ok: true,
      link: updated,
      fromSaved,
      toSaved,
      firstMsg,
      reciprocal,
      isNew: !link.first_message_at,
    };
  }

  /**
   * Complete pending reciprocal work where this account is the "to" side.
   */
  async function completePendingReciprocals(account, opts = {}) {
    const pending = await warmingData.listPendingReciprocalsFor(account.id);
    let done = 0;
    for (const link of pending) {
      const fromAcc = await warmingData.getAccountBrief(link.from_account_id);
      if (!fromAcc?.phone) continue;
      try {
        if (!link.to_saved_at) {
          const fromJid = `${phoneDigits(fromAcc.phone)}@s.whatsapp.net`;
          await session.saveContact(account.id, fromJid, {
            fullName: displayNameFor(fromAcc),
            firstName: displayNameFor(fromAcc),
            saveOnPrimary: true,
          });
          await warmingData.updatePeerLink(link.id, { to_saved_at: new Date() });
        }
        if (!link.reciprocal_message_at && link.first_message_at) {
          const fromJid = `${phoneDigits(fromAcc.phone)}@s.whatsapp.net`;
          await sleep(rand(1000, 4000));
          const reply = REPLY_TEXTS[rand(0, REPLY_TEXTS.length - 1)];
          await session.sendText(account.id, fromJid, reply, { delayMs: rand(400, 1500) });
          await warmingData.updatePeerLink(link.id, {
            reciprocal_message_at: new Date(),
            status: 'introduced',
          });
        } else if (link.to_saved_at || true) {
          await warmingData.updatePeerLink(link.id, {
            status: link.first_message_at ? 'introduced' : link.status,
          });
        }
        done += 1;
        if (opts.max && done >= opts.max) break;
        await sleep(rand(2000, 5000));
      } catch (e) {
        logger.warn('Warming reciprocal complete failed', {
          linkId: link.id, account: account.phone, error: e.message,
        });
        await warmingData.updatePeerLink(link.id, {
          last_error: e.message,
          retry_count: (link.retry_count || 0) + 1,
        });
      }
    }
    return { completed: done, total: pending.length };
  }

  /**
   * Casual follow-up to an already-introduced peer (no re-save).
   */
  async function sendPeerFollowUp(fromAcc, toAcc) {
    const digits = phoneDigits(toAcc.phone);
    if (digits.length < 8) return { ok: false };
    const peerJid = `${digits}@s.whatsapp.net`;
    const msg = PEER_TEXTS[rand(0, PEER_TEXTS.length - 1)];
    try {
      const sock = await session.getOrCreateSocket(fromAcc.id).catch(() => null);
      if (sock) {
        await sock.sendPresenceUpdate?.('composing', peerJid).catch(() => {});
        await sleep(rand(600, 2000));
        await sock.sendPresenceUpdate?.('paused', peerJid).catch(() => {});
      }
      await session.sendText(fromAcc.id, peerJid, msg, { delayMs: rand(300, 1200) });
      return { ok: true, msg };
    } catch (e) {
      logger.warn('Warming follow-up failed', { from: fromAcc.phone, to: toAcc.phone, error: e.message });
      return { ok: false, error: e.message };
    }
  }

  return {
    ensurePeerHandshake,
    completePendingReciprocals,
    sendPeerFollowUp,
    PEER_TEXTS,
  };
}

export default createPeerHandshake;
