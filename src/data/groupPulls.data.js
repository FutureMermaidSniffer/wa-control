import db from '../db/connection.js';

/**
 * Data access for group_pulls (拉群 tasks).
 * Mirrors patterns in warming.data.js / blasts.data.js
 */

export async function listGroupPulls(filters = {}) {
  let q = db('group_pulls as gp')
    .leftJoin('ws_accounts as wa', 'gp.admin_ws_account_id', 'wa.id')
    .select(
      'gp.*',
      'wa.phone as admin_phone',
      'wa.status as admin_status'
    );
  if (filters.status) q = q.where('gp.status', filters.status);
  if (filters.admin_ws_account_id) q = q.where('gp.admin_ws_account_id', filters.admin_ws_account_id);
  return q.orderBy('gp.created_at', 'desc').limit(filters.limit || 100);
}

export async function getGroupPull(id) {
  return db('group_pulls as gp')
    .leftJoin('ws_accounts as wa', 'gp.admin_ws_account_id', 'wa.id')
    .select('gp.*', 'wa.phone as admin_phone')
    .where('gp.id', id)
    .first();
}

export async function createGroupPull(data) {
  const insert = {
    subject: data.subject,
    admin_ws_account_id: data.admin_ws_account_id,
    target_contacts: data.target_contacts || null,
    target_count: data.target_count || 0,
    status: data.status || 'pending',
    created_by: data.created_by || null,
    notes: data.notes || null,
  };
  const [row] = await db('group_pulls').insert(insert).returning('*');
  return row;
}

export async function updateGroupPull(id, patch) {
  const [updated] = await db('group_pulls')
    .where({ id })
    .update({ ...patch, updated_at: db.fn.now() })
    .returning('*');
  return updated;
}

export async function setInvite(id, { invite_code, invite_link }) {
  return updateGroupPull(id, { invite_code, invite_link, status: 'qr_ready' });
}

export async function setGroupCreated(id, groupJid, added = 0) {
  return updateGroupPull(id, {
    created_group_jid: groupJid,
    added_count: added,
    status: added > 0 ? 'adding' : 'qr_ready',
  });
}

export async function incrementAdded(id, delta = 1) {
  await db('group_pulls')
    .where({ id })
    .increment('added_count', delta)
    .update({ updated_at: db.fn.now(), status: 'adding' });
  return getGroupPull(id);
}

export async function markCompleted(id) {
  return updateGroupPull(id, { status: 'completed' });
}

export async function markFailed(id, reason) {
  return updateGroupPull(id, { status: 'failed', notes: reason });
}

export default {
  listGroupPulls,
  getGroupPull,
  createGroupPull,
  updateGroupPull,
  setInvite,
  setGroupCreated,
  incrementAdded,
  markCompleted,
  markFailed,
};
