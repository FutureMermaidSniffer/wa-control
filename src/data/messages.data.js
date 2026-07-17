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
        contact_name: contactName || null,
        last_message_at: db.fn.now(),
      })
      .returning('*');
    convo = created;
  } else if (contactName && contactName !== convo.contact_name) {
    // Fill or refresh display name from WA pushName (no 3rd-party API)
    await db('conversations')
      .where({ id: convo.id })
      .update({ contact_name: contactName, updated_at: db.fn.now() });
    convo.contact_name = contactName;
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
  // Lateral-style last message for WhatsApp-like snippets
  const limit = filters.limit || 100;
  let q = db('conversations as c')
    .where({ 'c.ws_account_id': wsAccountId })
    .select(
      'c.*',
      db.raw(`(
        SELECT m.text FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.timestamp DESC NULLS LAST, m.created_at DESC
        LIMIT 1
      ) as last_message_text`),
      db.raw(`(
        SELECT m.direction FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.timestamp DESC NULLS LAST, m.created_at DESC
        LIMIT 1
      ) as last_message_direction`),
      db.raw(`(c.contact_phone LIKE '%@g.us') as is_group`)
    )
    .orderBy('c.last_message_at', 'desc');

  if (filters.unread) q = q.where('c.unread_count', '>', 0);
  if (filters.pinned !== undefined) q = q.where({ 'c.pinned': filters.pinned });

  const rows = await q.limit(limit);
  // Normalize is_group for PG boolean / string
  return rows.map((r) => ({
    ...r,
    is_group: r.is_group === true || r.is_group === 't' || r.is_group === 1
      || String(r.contact_phone || '').includes('@g.us'),
  }));
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
