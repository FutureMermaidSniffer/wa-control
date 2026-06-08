import messagesData from '../../data/messages.data.js';
import db from '../../db/connection.js';
import { getSessionManager } from './sessions.controller.js';
import { logger } from '../../utils/logger.js';

export async function listConversations(req, res, next) {
  try {
    const { accountId } = req.params;
    const convos = await messagesData.listConversationsForAccount(accountId, req.query);
    res.json({ data: convos });
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
    res.json({ data: msgs, conversation: convo });
  } catch (e) { next(e); }
}

export async function sendMessage(req, res, next) {
  try {
    const { accountId } = req.params;
    const { to, text } = req.body;

    if (!to || !text) return res.status(400).json({ error: 'to and text required' });

    const mgr = getSessionManager();
    let result = null;
    let sendError = null;

    try {
      result = await mgr.sendText(accountId, to, text, { delayMs: 300 + Math.random() * 1200 });
    } catch (e) {
      sendError = e.message || String(e);
      logger.warn('Send via Baileys failed (session may be offline)', { accountId, to, error: sendError });
    }

    // Always persist the outgoing attempt to history (useful for desk even on temp failure)
    // Normalize phone for storage (strip JID suffix if present)
    const phoneOnly = to.replace(/@.*/, '');
    const convo = await messagesData.findOrCreateConversation(accountId, phoneOnly);
    await messagesData.createMessage({
      conversation_id: convo.id,
      ws_account_id: accountId,
      direction: 'out',
      text,
      wa_message_id: result?.key?.id || null,
      timestamp: new Date(),
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
      return res.status(202).json({ success: false, accepted: true, error: sendError, note: 'Message stored; will retry when session is live' });
    }

    res.json({ success: true, result });
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
