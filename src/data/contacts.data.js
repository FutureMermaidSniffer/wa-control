import db from '../db/connection.js';

export async function listContacts(filters = {}) {
  let q = db('contacts').select('*').orderBy('created_at', 'desc').limit(filters.limit || 100);
  if (filters.assigned_ws_account_id) q = q.where({ assigned_ws_account_id: filters.assigned_ws_account_id });
  if (filters.dnd !== undefined) q = q.where({ dnd: filters.dnd });
  return q;
}

export async function createContact(data) {
  const [row] = await db('contacts').insert(data).returning('*');
  return row;
}

export async function importContacts(contacts, defaultWs = null) {
  const results = [];
  for (const c of contacts) {
    if (!c.phone) continue;
    try {
      const [ins] = await db('contacts').insert({
        phone: c.phone,
        name: c.name,
        source: c.source || 'import',
        tags: c.tags || [],
        assigned_ws_account_id: c.assigned_ws_account_id || defaultWs,
        opted_in: c.opted_in !== false,
      }).returning('*');
      results.push({ phone: c.phone, id: ins.id, status: 'ok' });
    } catch (e) {
      results.push({ phone: c.phone, status: 'error', error: e.message });
    }
  }
  return results;
}

export default { listContacts, createContact, importContacts };
