import messagesData from '../../data/messages.data.js';
import db from '../../db/connection.js';
import { logger } from '../../utils/logger.js';
import { normalizeWaPhone, toWaJid, formatPhonePretty } from '../../utils/phone.js';
import { getSessionEngine } from '../../core/engine/SessionEngine.js';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import config from '../../config/index.js';

/** In-memory avatar URL cache: key accountId:phone → { url, localPath, at } */
const avatarCache = new Map();
const AVATAR_TTL_MS = 6 * 60 * 60 * 1000;

/**
 * messages.wa_status is INTEGER (Baileys WAMessageStatus).
 * Soft ack objects use status: 'timeout_ok' | 'no_id' — never write those as wa_status.
 * @returns {number|null}
 */
function numericWaStatus(ackOrStatus) {
  if (ackOrStatus == null) return null;
  // full ack object from SessionManager
  if (typeof ackOrStatus === 'object') {
    if (ackOrStatus.soft) return null;
    const s = ackOrStatus.status;
    if (typeof s === 'number' && Number.isFinite(s)) return s;
    return null;
  }
  if (typeof ackOrStatus === 'number' && Number.isFinite(ackOrStatus)) return ackOrStatus;
  return null;
}

export async function listConversations(req, res, next) {
  try {
    const { accountId } = req.params;
    const convos = await messagesData.listConversationsForAccount(accountId, req.query);
    const data = (convos || []).map((c) => ({
      ...c,
      contact_phone_pretty: formatPhonePretty(c.contact_phone),
      last_message_snippet: c.last_message_text
        ? (c.last_message_direction === 'out' ? `You: ${c.last_message_text}` : c.last_message_text)
        : '',
    }));
    res.json({ data });
  } catch (e) { next(e); }
}

/**
 * Resolve best JID candidate list for avatar / send peer cache.
 */
async function resolvePeerLookup(accountId, phoneParam) {
  const raw = String(phoneParam || '').trim();
  const digits = normalizeWaPhone(raw.includes('@') ? raw.split('@')[0] : raw, {
    requireCountry: false,
    throwOnInvalid: false,
  });
  let convo = null;
  try {
    convo = await db('conversations')
      .where({ ws_account_id: accountId })
      .where(function () {
        this.where({ contact_phone: digits })
          .orWhere({ contact_lid: digits })
          .orWhere({ contact_phone: raw });
        if (digits) {
          this.orWhere({ peer_remote_jid: `${digits}@lid` })
            .orWhere({ peer_phone_jid: `${digits}@s.whatsapp.net` });
        }
      })
      .first();
  } catch (_) {
    convo = await db('conversations')
      .where({ ws_account_id: accountId, contact_phone: digits || raw })
      .first()
      .catch(() => null);
  }
  return { digits, raw, convo };
}

/**
 * GET profile picture for a contact (Baileys → cache → /uploads/avatars/…).
 * Uses conversation peer_phone_jid when the list key is a LID.
 */
export async function getContactAvatar(req, res, next) {
  try {
    const { accountId, phone } = req.params;
    const { digits, convo } = await resolvePeerLookup(accountId, phone);

    // Prefer real phone digits for cache key so LID + PN share one avatar
    const phoneKey = (convo?.peer_phone_jid
      ? String(convo.peer_phone_jid).replace(/@.*/, '')
      : null)
      || (convo?.contact_phone && String(convo.contact_phone).length < 15 ? convo.contact_phone : null)
      || digits
      || phone;

    const cacheKey = `${accountId}:${phoneKey}`;
    const cached = avatarCache.get(cacheKey);
    if (cached && Date.now() - cached.at < AVATAR_TTL_MS && cached.localPath) {
      return res.json({ url: cached.localPath, cached: true, phone: phoneKey });
    }

    // Baileys lookup candidates: phone JID first, then LID, then raw
    const tryIds = [];
    if (convo?.peer_phone_jid) tryIds.push(convo.peer_phone_jid);
    if (phoneKey && phoneKey.length < 15) tryIds.push(phoneKey);
    if (convo?.peer_remote_jid) tryIds.push(convo.peer_remote_jid);
    if (digits) tryIds.push(digits);
    tryIds.push(phone);

    let remoteUrl = null;
    const engine = getSessionEngine();
    for (const id of tryIds) {
      try {
        remoteUrl = await engine.getProfilePictureUrl(accountId, id);
        if (remoteUrl) break;
      } catch (_) { /* try next */ }
    }
    if (!remoteUrl) return res.status(404).json({ error: 'no profile picture' });

    const uploadDir = path.join(config.UPLOAD_DIR || './uploads', 'avatars');
    await fs.mkdir(uploadDir, { recursive: true });
    const hash = crypto.createHash('sha1').update(cacheKey).digest('hex').slice(0, 16);
    const filename = `${hash}.jpg`;
    const filepath = path.join(uploadDir, filename);
    const publicPath = `/uploads/avatars/${filename}`;

    try {
      const resp = await fetch(remoteUrl);
      if (resp.ok) {
        const buf = Buffer.from(await resp.arrayBuffer());
        await fs.writeFile(filepath, buf);
        avatarCache.set(cacheKey, { url: remoteUrl, localPath: publicPath, at: Date.now() });
        return res.json({ url: publicPath, cached: false, phone: phoneKey });
      }
    } catch (e) {
      logger.warn('Avatar download failed', { error: e.message });
    }
    avatarCache.set(cacheKey, { url: remoteUrl, localPath: remoteUrl, at: Date.now() });
    res.json({ url: remoteUrl, remote: true, phone: phoneKey });
  } catch (e) { next(e); }
}

export async function getMessages(req, res, next) {
  try {
    const { accountId, phone } = req.params;
    let convo = await db('conversations')
      .where({ ws_account_id: accountId, contact_phone: phone })
      .first();
    if (!convo) {
      convo = await db('conversations')
        .where({ ws_account_id: accountId, contact_lid: phone })
        .first()
        .catch(() => null);
    }

    if (!convo) return res.json({ data: [], conversation: null });

    const msgs = await messagesData.listMessages(convo.id, Number(req.query.limit) || 100);
    const isLid = !!(convo.contact_lid && convo.contact_phone === convo.contact_lid)
      || /^\d{15,}$/.test(String(convo.contact_phone || ''));
    const enriched = (msgs || []).map((m) => ({
      ...m,
      phone: convo.contact_phone,
      lid: convo.contact_lid || null,
      name: convo.contact_name || null,
      isLid,
      media_url: m.media?.url || m.media?.localPath || null,
      media_type: m.media?.type || null,
    }));
    res.json({ data: enriched, conversation: convo });
  } catch (e) { next(e); }
}

/** Shared: resolve send target JID from conversation peer cache */
async function resolveSendTo(accountId, to) {
  const jid = to.includes('@') ? to : toWaJid(to);
  const phoneOnly = normalizeWaPhone(to.includes('@') ? to.split('@')[0] : to, {
    requireCountry: false,
    throwOnInvalid: false,
  });

  let sendTo = jid;
  try {
    const convoRow = await db('conversations')
      .where({ ws_account_id: accountId, contact_phone: phoneOnly })
      .first();
    if (convoRow?.peer_remote_jid) {
      sendTo = convoRow.peer_remote_jid;
    } else if (convoRow?.peer_phone_jid) {
      sendTo = convoRow.peer_phone_jid;
    } else {
      const lastIn = await db('messages')
        .join('conversations', 'conversations.id', 'messages.conversation_id')
        .where({
          'messages.ws_account_id': accountId,
          'conversations.contact_phone': phoneOnly,
          'messages.direction': 'in',
        })
        .orderBy('messages.timestamp', 'desc')
        .select('messages.raw')
        .first();
      const remote = lastIn?.raw?.key?.remoteJid;
      const pn = lastIn?.raw?.key?.senderPn || lastIn?.raw?.peer?.jid;
      if (remote && String(remote).endsWith('@lid')) sendTo = remote;
      else if (pn && String(pn).includes('@')) sendTo = pn;
    }
  } catch (_) { /* ignore */ }

  return { sendTo, phoneOnly, jid };
}

/**
 * POST text and/or media.
 * JSON: { to, text }
 * multipart: fields to, text/caption + file field "media" or "file"
 */
export async function sendMessage(req, res, next) {
  try {
    const { accountId } = req.params;
    const to = req.body?.to;
    const text = (req.body?.text || req.body?.caption || '').trim();
    const file = req.file;

    if (!to) return res.status(400).json({ error: 'to required' });
    if (!text && !file) return res.status(400).json({ error: 'text or media file required' });

    const engine = getSessionEngine();
    let result = null;
    let sendError = null;
    let errorCode = null;
    const { sendTo, phoneOnly } = await resolveSendTo(accountId, to);

    let mediaMeta = null;
    let storeText = text || '';

    try {
      if (file) {
        const uploadDir = path.join(config.UPLOAD_DIR || './uploads', 'chat-media');
        await fs.mkdir(uploadDir, { recursive: true });
        const ext = path.extname(file.originalname || '') || (
          file.mimetype?.startsWith('image/') ? '.jpg'
            : file.mimetype?.startsWith('video/') ? '.mp4' : '.bin'
        );
        const fname = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
        const fpath = path.join(uploadDir, fname);
        await fs.writeFile(fpath, file.buffer);
        const publicPath = `/uploads/chat-media/${fname}`;

        let mediaType = 'document';
        if (file.mimetype?.startsWith('image/')) mediaType = 'image';
        else if (file.mimetype?.startsWith('video/')) mediaType = 'video';
        else if (file.mimetype?.startsWith('audio/')) mediaType = 'audio';

        result = await engine.sendMedia(accountId, sendTo, {
          buffer: file.buffer,
          mimetype: file.mimetype,
          caption: text || '',
          fileName: file.originalname || fname,
          mediaType,
          delayMs: 80 + Math.random() * 200,
          prepPresence: true,
        });

        mediaMeta = {
          type: mediaType,
          url: publicPath,
          localPath: publicPath,
          mimetype: file.mimetype,
          fileName: file.originalname || fname,
          size: file.size,
        };
        storeText = text || (mediaType === 'image' ? '[image]' : mediaType === 'video' ? '[video]' : `[${mediaType}]`);
      } else {
        result = await engine.sendText(accountId, sendTo, text, {
          delayMs: 80 + Math.random() * 200,
          ackTimeoutMs: 12000,
          prepPresence: true,
        });
        storeText = text;
      }
    } catch (e) {
      sendError = e.message || String(e);
      errorCode = e.code
        || (e.code !== 'WA_ACK_TIMEOUT' && /(?:^|\D)463(?:\D|$)/.test(sendError) ? 'WA_ACK_463' : null)
        || 'SEND_FAILED';
      logger.warn('Send via Baileys failed', {
        accountId,
        to: sendTo,
        error: sendError,
        code: errorCode,
        media: !!file,
      });
    }

    const deliveryStatus = sendError
      ? 'failed'
      : (result?.deliveryStatus || 'server_ack');

    const convo = await messagesData.findOrCreateConversation(accountId, phoneOnly);

    // Soft-fail cleanup: if this text previously failed, upgrade that row instead of stacking
    let msgRow = null;
    if (!sendError && storeText) {
      const recentFail = await db('messages')
        .where({
          conversation_id: convo.id,
          direction: 'out',
          text: storeText,
          delivery_status: 'failed',
        })
        .where('timestamp', '>', new Date(Date.now() - 5 * 60 * 1000))
        .orderBy('timestamp', 'desc')
        .first();
      if (recentFail) {
        const [updated] = await db('messages')
          .where({ id: recentFail.id })
          .update({
            delivery_status: deliveryStatus,
            fail_reason: null,
            wa_message_id: result?.key?.id || recentFail.wa_message_id,
            media: mediaMeta || recentFail.media,
            wa_status: numericWaStatus(result?.ack),
            updated_at: db.fn.now(),
            raw: {
              ...(recentFail.raw || {}),
              recovered: true,
              sendTo,
              key: result?.key,
              ack: result?.ack,
            },
          })
          .returning('*');
        msgRow = updated;
        await messagesData.updateConversationLastMessage(convo.id, new Date());
      }
    }

    if (!msgRow) {
      msgRow = await messagesData.createMessage({
        conversation_id: convo.id,
        ws_account_id: accountId,
        direction: 'out',
        text: storeText,
        media: mediaMeta,
        wa_message_id: result?.key?.id || null,
        timestamp: new Date(),
        delivery_status: deliveryStatus,
        fail_reason: sendError || null,
        wa_status: numericWaStatus(result?.ack),
        raw: {
          ...(sendError ? { sendError, failed: true, errorCode } : {}),
          sendTo,
          media: mediaMeta,
          key: result?.key || undefined,
          ack: result?.ack || undefined,
        },
      });
    }

    try {
      await db('contacts')
        .insert({
          phone: phoneOnly,
          assigned_ws_account_id: accountId,
          source: 'desk_chat',
          opted_in: true,
        })
        .onConflict(['phone', 'assigned_ws_account_id'])
        .ignore();
    } catch (e) { /* ignore */ }

    if (sendError) {
      const is463 = errorCode === 'WA_ACK_463';
      const isOffline = /offline|reconnect|NO_AUTH|not live/i.test(sendError);
      return res.status(isOffline ? 503 : 409).json({
        success: false,
        error: sendError,
        code: errorCode,
        delivery_status: 'failed',
        messageId: msgRow?.id || null,
        wa_message_id: result?.key?.id || null,
        hint: is463
          ? 'WhatsApp reach-out lock (463): message was not accepted for immediate delivery.'
          : isOffline
            ? 'WhatsApp session is offline. Click Reconnect, then retry.'
            : 'Send failed at the transport layer.',
      });
    }

    res.json({
      success: true,
      result,
      delivery_status: deliveryStatus,
      messageId: msgRow?.id || null,
      wa_message_id: result?.key?.id || null,
      media: mediaMeta,
      text: storeText,
    });
  } catch (e) { next(e); }
}

export async function markRead(req, res, next) {
  try {
    const { accountId, phone } = req.params;
    let convo = await db('conversations')
      .where({ ws_account_id: accountId, contact_phone: phone })
      .first();
    if (!convo) {
      convo = await db('conversations')
        .where({ ws_account_id: accountId, contact_lid: phone })
        .first()
        .catch(() => null);
    }
    if (convo) await messagesData.markConversationRead(convo.id);
    res.json({ success: true });
  } catch (e) { next(e); }
}
