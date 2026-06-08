import db from '../db/connection.js';

export async function findOrCreateConversation(wsAccountId, contactPhone, contactName = null) {
  let convo = await db('conversations')
    .where({ ws_account_id: wsAccountId, contact_phone: contactPhone })
    .first();

  if (!convo) {
    const [created] = await db('conversations')
      .insert({
        ws_account_id: wsAccountId,
        contact_phone: contactPhone,
        contact_name: contactName,
        last_message_at: db.fn.now(),
      })
      .returning('*');
    convo = created;
  }
  return convo;
}

export async function updateConversationLastMessage(convoId, timestamp = null) {
  await db('conversations')
    .where({ id: convoId })
    .update({
      last_message_at: timestamp || db.fn.now(),
      updated_at: db.fn.now(),
    });
}

export async function listConversationsForAccount(wsAccountId, filters = {}) {
  let q = db('conversations')
    .where({ ws_account_id: wsAccountId })
    .orderBy('last_message_at', 'desc');

  if (filters.unread) q = q.where('unread_count', '>', 0);
  if (filters.pinned !== undefined) q = q.where({ pinned: filters.pinned });

  return q.limit(filters.limit || 100);
}

export async function getConversation(id) {
  return db('conversations').where({ id }).first();
}

export async function createMessage(data) {
  const [msg] = await db('messages')
    .insert({
      conversation_id: data.conversation_id,
      ws_account_id: data.ws_account_id,
      direction: data.direction,
      text: data.text,
      media: data.media || null,
      wa_message_id: data.wa_message_id || null,
      timestamp: data.timestamp || db.fn.now(),
      raw: data.raw || null,
    })
    .returning('*');

  // bump last message + unread if inbound
  await updateConversationLastMessage(data.conversation_id, data.timestamp);

  if (data.direction === 'in') {
    await db('conversations')
      .where({ id: data.conversation_id })
      .increment('unread_count', 1)
      .update({ updated_at: db.fn.now() });
  }

  return msg;
}

export async function listMessages(convoId, limit = 50) {
  return db('messages')
    .where({ conversation_id: convoId })
    .orderBy('timestamp', 'asc')
    .limit(limit);
}

export async function markConversationRead(convoId) {
  await db('conversations')
    .where({ id: convoId })
    .update({ unread_count: 0, updated_at: db.fn.now() });
}

export default {
  findOrCreateConversation,
  listConversationsForAccount,
  getConversation,
  createMessage,
  listMessages,
  markConversationRead,
  updateConversationLastMessage,
};
