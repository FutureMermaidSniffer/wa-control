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

/**
 * Cache the JIDs WhatsApp used for this peer (from inbound).
 * Enables instant correct outbound addressing without heavy history scans.
 */
export async function updateConversationPeerJids(convoId, { remoteJid, phoneJid } = {}) {
  if (!convoId) return;
  const patch = { peer_jid_updated_at: db.fn.now(), updated_at: db.fn.now() };
  if (remoteJid) patch.peer_remote_jid = remoteJid;
  if (phoneJid) patch.peer_phone_jid = phoneJid;
  if (!remoteJid && !phoneJid) return;
  await db('conversations').where({ id: convoId }).update(patch);
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
  const insertRow = {
    conversation_id: data.conversation_id,
    ws_account_id: data.ws_account_id,
    direction: data.direction,
    text: data.text,
    media: data.media || null,
    wa_message_id: data.wa_message_id || null,
    timestamp: data.timestamp || db.fn.now(),
    raw: data.raw || null,
    delivery_status: data.delivery_status || (data.direction === 'out' ? 'pending' : null),
    fail_reason: data.fail_reason || null,
    wa_status: data.wa_status ?? null,
  };

  // Dedup: if same WA id already stored (desk insert + Baileys upsert), update not double-insert
  if (insertRow.wa_message_id && insertRow.ws_account_id) {
    const existing = await db('messages')
      .where({
        ws_account_id: insertRow.ws_account_id,
        wa_message_id: insertRow.wa_message_id,
      })
      .first();
    if (existing) {
      const patch = {
        text: insertRow.text || existing.text,
        raw: insertRow.raw || existing.raw,
        updated_at: db.fn.now(),
      };
      if (insertRow.delivery_status) patch.delivery_status = insertRow.delivery_status;
      if (insertRow.fail_reason != null) patch.fail_reason = insertRow.fail_reason;
      if (insertRow.wa_status != null) patch.wa_status = insertRow.wa_status;
      const [updated] = await db('messages')
        .where({ id: existing.id })
        .update(patch)
        .returning('*');
      await updateConversationLastMessage(existing.conversation_id, insertRow.timestamp);
      return updated || existing;
    }
  }

  let msg;
  try {
    [msg] = await db('messages')
      .insert(insertRow)
      .returning('*');
  } catch (e) {
    // Race with concurrent upsert of same wa_message_id
    if (insertRow.wa_message_id && /unique|duplicate/i.test(e.message || '')) {
      return updateMessageDeliveryByWaId(insertRow.ws_account_id, insertRow.wa_message_id, {
        deliveryStatus: insertRow.delivery_status,
        failReason: insertRow.fail_reason,
        waStatus: insertRow.wa_status,
        rawPatch: insertRow.raw,
      });
    }
    throw e;
  }

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

/**
 * Update delivery lifecycle for an outbound message by WhatsApp message id.
 * @returns {object|null} updated row
 */
export async function updateMessageDeliveryByWaId(wsAccountId, waMessageId, {
  deliveryStatus,
  failReason = null,
  waStatus = null,
  rawPatch = null,
} = {}) {
  if (!wsAccountId || !waMessageId) return null;
  const row = await db('messages')
    .where({ ws_account_id: wsAccountId, wa_message_id: waMessageId })
    .first();
  if (!row) return null;

  const patch = { updated_at: db.fn.now() };
  if (deliveryStatus) patch.delivery_status = deliveryStatus;
  if (failReason != null) patch.fail_reason = failReason;
  if (waStatus != null) patch.wa_status = waStatus;
  if (rawPatch && typeof rawPatch === 'object') {
    patch.raw = { ...(row.raw || {}), ...rawPatch };
  }

  // Never downgrade a stronger status (delivered/read) to weaker, except failed
  const rank = { pending: 0, queued: 1, server_ack: 2, delivered: 3, read: 4, failed: -1 };
  if (
    deliveryStatus &&
    deliveryStatus !== 'failed' &&
    row.delivery_status &&
    rank[row.delivery_status] != null &&
    rank[deliveryStatus] != null &&
    rank[deliveryStatus] < rank[row.delivery_status]
  ) {
    delete patch.delivery_status;
  }

  const [updated] = await db('messages').where({ id: row.id }).update(patch).returning('*');
  return updated || row;
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
  updateConversationPeerJids,
  listConversationsForAccount,
  getConversation,
  createMessage,
  updateMessageDeliveryByWaId,
  listMessages,
  markConversationRead,
  updateConversationLastMessage,
};
