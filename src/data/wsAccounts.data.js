import db from '../db/connection.js';
import { normalizeWaPhone } from '../utils/phone.js';

export async function createAccount(data) {
  const payload = { ...data };
  if (payload.phone) {
    try {
      payload.phone = normalizeWaPhone(payload.phone);
    } catch {
      payload.phone = String(payload.phone).replace(/\D/g, '');
    }
  }
  const [row] = await db('ws_accounts')
    .insert(payload)
    .returning('*');
  return row;
}

export async function findById(id) {
  return db('ws_accounts').where({ id }).first();
}

export async function findByPhone(phone) {
  if (!phone) return null;
  let digits;
  try {
    digits = normalizeWaPhone(phone, { throwOnInvalid: false, requireCountry: false });
  } catch {
    digits = String(phone).replace(/\D/g, '');
  }
  // Match digits-only or legacy +prefix storage
  return db('ws_accounts')
    .where({ phone: digits })
    .orWhere({ phone: `+${digits}` })
    .orWhere({ phone })
    .first();
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
