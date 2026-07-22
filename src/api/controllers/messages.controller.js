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
 * GET profile picture for a contact (Baileys → cache → /uploads/avatars/…).
 */
export async function getContactAvatar(req, res, next) {
  try {
    const { accountId, phone } = req.params;
    const digits = normalizeWaPhone(phone, { requireCountry: false, throwOnInvalid: false });
    const cacheKey = `${accountId}:${digits}`;
    const cached = avatarCache.get(cacheKey);
    if (cached && Date.now() - cached.at < AVATAR_TTL_MS && cached.localPath) {
      return res.json({ url: cached.localPath, cached: true });
    }

    let remoteUrl = null;
    try {
      remoteUrl = await getSessionEngine().getProfilePictureUrl(accountId, digits);
    } catch (e) {
      return res.status(404).json({ error: 'avatar unavailable', detail: e.message });
    }
    if (!remoteUrl) return res.status(404).json({ error: 'no profile picture' });

    // Download & store locally so browser can load without WA CDN cookies
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
        return res.json({ url: publicPath, cached: false });
      }
    } catch (e) {
      logger.warn('Avatar download failed', { error: e.message });
    }
    // Fall back to remote URL (may or may not load in browser)
    avatarCache.set(cacheKey, { url: remoteUrl, localPath: remoteUrl, at: Date.now() });
    res.json({ url: remoteUrl, remote: true });
  } catch (e) { next(e); }
}

export async function getMessages(req, res, next) {
  try {
    const { accountId, phone } = req.params; // or use convo id later
    // Find convo by account + phone
    const convo = await db('conversations')
      .where({ ws_account_id: accountId, contact_phone: phone })
      .first();

    if (!convo) return res.json({ data: [], conversation: null });

    const msgs = await messagesData.listMessages(convo.id, Number(req.query.limit) || 100);
    // Attach peer phone/name on each message so desk never shows text-only rows
    const enriched = (msgs || []).map((m) => ({
      ...m,
      phone: convo.contact_phone,
      name: convo.contact_name || null,
      isLid: /^\d{15,}$/.test(String(convo.contact_phone || '')),
    }));
    res.json({ data: enriched, conversation: convo });
  } catch (e) { next(e); }
}

export async function sendMessage(req, res, next) {
  try {
    const { accountId } = req.params;
    const { to, text } = req.body;

    if (!to || !text) return res.status(400).json({ error: 'to and text required' });

    const engine = getSessionEngine();
    let result = null;
    let sendError = null;
    let errorCode = null;
    const jid = toWaJid(to);
    const phoneOnly = normalizeWaPhone(to.includes('@') ? to.split('@')[0] : to, {
      requireCountry: false,
      throwOnInvalid: false,
    });

    // Prefer conversation peer cache (filled on inbound) — same JID path receive used
    let sendTo = jid;
    try {
      const convoRow = await db('conversations')
        .where({ ws_account_id: accountId, contact_phone: phoneOnly })
        .first();
      if (convoRow?.peer_remote_jid) {
        sendTo = convoRow.peer_remote_jid;
        logger.info('[SEND-API] using convo peer_remote_jid', { accountId, phoneOnly, sendTo });
      } else if (convoRow?.peer_phone_jid) {
        sendTo = convoRow.peer_phone_jid;
        logger.info('[SEND-API] using convo peer_phone_jid', { accountId, phoneOnly, sendTo });
      } else {
        // Fallback: last inbound key
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
        if (remote && String(remote).endsWith('@lid')) {
          sendTo = remote;
          logger.info('[SEND-API] using history LID', { accountId, phoneOnly, sendTo, pn });
        } else if (pn && String(pn).includes('@')) {
          sendTo = pn;
          logger.info('[SEND-API] using history PN', { accountId, phoneOnly, sendTo });
        }
      }
    } catch (_) { /* ignore */ }

    try {
      // Desk: short human delay only; require real SERVER_ACK (no timeout_ok lies)
      result = await engine.sendText(accountId, sendTo, text, {
        delayMs: 80 + Math.random() * 200,
        requirePositiveAck: true,
        ackTimeoutMs: 8000,
        prepPresence: true,
      });
    } catch (e) {
      sendError = e.message || String(e);
      errorCode = e.code || (/463/.test(sendError) ? 'WA_ACK_463' : 'SEND_FAILED');
      logger.warn('Send via Baileys failed', {
        accountId,
        to: sendTo,
        error: sendError,
        code: errorCode,
      });
    }

    const deliveryStatus = sendError
      ? 'failed'
      : (result?.deliveryStatus || 'server_ack');

    // Persist attempt (including failures) so desk history shows what was tried
    const convo = await messagesData.findOrCreateConversation(accountId, phoneOnly);
    const msgRow = await messagesData.createMessage({
      conversation_id: convo.id,
      ws_account_id: accountId,
      direction: 'out',
      text,
      wa_message_id: result?.key?.id || null,
      timestamp: new Date(),
      delivery_status: deliveryStatus,
      fail_reason: sendError || null,
      wa_status: result?.ack?.status ?? null,
      raw: {
        ...(sendError ? { sendError, failed: true, errorCode } : {}),
        sendTo,
        message: result ? { conversation: text } : undefined,
        key: result?.key || undefined,
        ack: result?.ack || undefined,
      },
    });

    // Auto-assign / create contact for this WS number (desk usage)
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
    } catch (e) {
      // ignore conflicts / duplicates
    }

    if (sendError) {
      const is463 = errorCode === 'WA_ACK_463' || /463|reach-out/i.test(sendError);
      const isOffline = /offline|reconnect|NO_AUTH|not live/i.test(sendError);
      return res.status(isOffline ? 503 : 409).json({
        success: false,
        error: sendError,
        code: errorCode,
        delivery_status: 'failed',
        messageId: msgRow?.id || null,
        wa_message_id: result?.key?.id || null,
        hint: is463
          ? 'WhatsApp reach-out lock (463): message was not accepted for immediate delivery. Reply to contacts who messaged you first, warm the number, or retry later. Do not assume the phone received it.'
          : isOffline
            ? 'WhatsApp session is offline or flapping. Click Reconnect and wait for Session OPEN, then retry.'
            : 'Send failed — message was not confirmed by WhatsApp.',
      });
    }

    res.json({
      success: true,
      result,
      delivery_status: deliveryStatus,
      messageId: msgRow?.id || null,
      wa_message_id: result?.key?.id || null,
    });
  } catch (e) { next(e); }
}

export async function markRead(req, res, next) {
  try {
    const { accountId, phone } = req.params;
    const convo = await db('conversations')
      .where({ ws_account_id: accountId, contact_phone: phone })
      .first();
    if (convo) await messagesData.markConversationRead(convo.id);
    res.json({ success: true });
  } catch (e) { next(e); }
}
