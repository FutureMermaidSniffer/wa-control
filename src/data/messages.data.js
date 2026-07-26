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
 * Find conversation already linked to this LID remote JID (peer_remote_jid or contact_lid).
 */
export async function findConversationByLid(wsAccountId, lidUserOrJid) {
  if (!lidUserOrJid) return null;
  const lidUser = String(lidUserOrJid).replace(/@.*/, '').replace(/\D/g, '');
  if (!lidUser) return null;
  const lidJid = `${lidUser}@lid`;
  // Prefer peer cache (filled on inbound)
  let convo = await db('conversations')
    .where({ ws_account_id: wsAccountId, peer_remote_jid: lidJid })
    .first()
    .catch(() => null);
  if (convo) return convo;
  // contact_lid column (if present from 008)
  convo = await db('conversations')
    .where({ ws_account_id: wsAccountId, contact_lid: lidUser })
    .first()
    .catch(() => null);
  if (convo) return convo;
  // Legacy: conversation keyed by raw LID digits
  convo = await db('conversations')
    .where({ ws_account_id: wsAccountId, contact_phone: lidUser })
    .first();
  return convo || null;
}

/**
 * Merge source conversation into target (move messages, delete source).
 * Used when we learn phone for a previously LID-only thread.
 */
export async function mergeConversations(wsAccountId, fromContactPhone, toContactPhone, extras = {}) {
  if (!fromContactPhone || !toContactPhone || fromContactPhone === toContactPhone) return null;

  const source = await db('conversations')
    .where({ ws_account_id: wsAccountId, contact_phone: fromContactPhone })
    .first();
  if (!source) return null;

  let target = await db('conversations')
    .where({ ws_account_id: wsAccountId, contact_phone: toContactPhone })
    .first();

  if (!target) {
    const [updated] = await db('conversations')
      .where({ id: source.id })
      .update({
        contact_phone: toContactPhone,
        contact_name: extras.contactName || source.contact_name,
        contact_lid: extras.contactLid || source.contact_lid || fromContactPhone,
        peer_remote_jid: extras.peerRemoteJid || source.peer_remote_jid,
        peer_phone_jid: extras.peerPhoneJid || source.peer_phone_jid,
        peer_jid_updated_at: db.fn.now(),
        updated_at: db.fn.now(),
      })
      .returning('*')
      .catch(async () => {
        // contact_lid may not exist on older DBs
        const [u] = await db('conversations')
          .where({ id: source.id })
          .update({
            contact_phone: toContactPhone,
            contact_name: extras.contactName || source.contact_name,
            peer_remote_jid: extras.peerRemoteJid || source.peer_remote_jid,
            peer_phone_jid: extras.peerPhoneJid || source.peer_phone_jid,
            peer_jid_updated_at: db.fn.now(),
            updated_at: db.fn.now(),
          })
          .returning('*');
        return [u];
      });
    return updated;
  }

  await db('messages')
    .where({ conversation_id: source.id })
    .update({ conversation_id: target.id });

  const lastAt = [source.last_message_at, target.last_message_at]
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a))[0];

  const patch = {
    unread_count: (target.unread_count || 0) + (source.unread_count || 0),
    last_message_at: lastAt || target.last_message_at,
    contact_name: extras.contactName || target.contact_name || source.contact_name,
    peer_remote_jid: extras.peerRemoteJid || target.peer_remote_jid || source.peer_remote_jid,
    peer_phone_jid: extras.peerPhoneJid || target.peer_phone_jid || source.peer_phone_jid,
    peer_jid_updated_at: db.fn.now(),
    updated_at: db.fn.now(),
  };
  if (extras.contactLid || source.contact_lid) {
    patch.contact_lid = extras.contactLid || target.contact_lid || source.contact_lid;
  }

  await db('conversations').where({ id: target.id }).update(patch).catch(async () => {
    delete patch.contact_lid;
    await db('conversations').where({ id: target.id }).update(patch);
  });
  await db('conversations').where({ id: source.id }).del();
  return db('conversations').where({ id: target.id }).first();
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
    // integer column only — reject soft strings like "timeout_ok"
    wa_status: (typeof data.wa_status === 'number' && Number.isFinite(data.wa_status))
      ? data.wa_status
      : null,
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
  if (typeof waStatus === 'number' && Number.isFinite(waStatus)) {
    patch.wa_status = waStatus;
  }
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

/**
 * List messages for a conversation.
 * Collapses "failed then success" twins: consecutive outbound same text within 3 min
 * keeps the successful (or latest) row so the desk does not show Failed + ✓✓ duplicates.
 */
export async function listMessages(convoId, limit = 100) {
  const rows = await db('messages')
    .where({ conversation_id: convoId })
    .orderBy('timestamp', 'asc')
    .limit(Math.min(Number(limit) || 100, 300));

  const out = [];
  for (const m of rows) {
    const prev = out[out.length - 1];
    if (
      prev
      && prev.direction === 'out'
      && m.direction === 'out'
      && String(prev.text || '') === String(m.text || '')
      && prev.text
      && Math.abs(new Date(m.timestamp) - new Date(prev.timestamp)) < 3 * 60 * 1000
    ) {
      const prevFailed = prev.delivery_status === 'failed';
      const curFailed = m.delivery_status === 'failed';
      // Prefer non-failed; if both failed keep latest; if both ok keep latest
      if (prevFailed && !curFailed) {
        out[out.length - 1] = m;
        continue;
      }
      if (!prevFailed && curFailed) {
        continue; // drop failed after success
      }
      // same fate — keep latest
      out[out.length - 1] = m;
      continue;
    }
    out.push(m);
  }
  return out;
}

export async function markConversationRead(convoId) {
  await db('conversations')
    .where({ id: convoId })
    .update({ unread_count: 0, updated_at: db.fn.now() });
}

export default {
  findOrCreateConversation,
  findConversationByLid,
  mergeConversations,
  updateConversationPeerJids,
  listConversationsForAccount,
  getConversation,
  createMessage,
  updateMessageDeliveryByWaId,
  listMessages,
  markConversationRead,
  updateConversationLastMessage,
};
