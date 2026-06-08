import db from '../db/connection.js';

export async function createAccount(data) {
  const [row] = await db('ws_accounts')
    .insert(data)
    .returning('*');
  return row;
}

export async function findById(id) {
  return db('ws_accounts').where({ id }).first();
}

export async function findByPhone(phone) {
  return db('ws_accounts').where({ phone }).first();
}

export async function list(filters = {}) {
  let q = db('ws_accounts').select('*');
  if (filters.status) q = q.where({ status: filters.status });
  if (filters.group_id) q = q.where({ group_id: filters.group_id });
  if (filters.is_in_warehouse !== undefined) q = q.where({ is_in_warehouse: filters.is_in_warehouse });
  return q.orderBy('created_at', 'desc').limit(filters.limit || 200);
}

export async function updateStatus(id, status, extra = {}) {
  return db('ws_accounts')
    .where({ id })
    .update({ status, ...extra, updated_at: db.fn.now() });
}

export async function assignProxy(accountId, proxyId) {
  return db('ws_accounts').where({ id: accountId }).update({ proxy_id: proxyId, updated_at: db.fn.now() });
}

export default { createAccount, findById, findByPhone, list, updateStatus, assignProxy };
