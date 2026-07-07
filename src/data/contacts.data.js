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

export async function cleanNonUsableContacts({ assigned_ws_account_id = null, dryRun = true } = {}) {
  let q = db('contacts').where({ dnd: true }).orWhere({ opted_in: false });
  if (assigned_ws_account_id) q = q.andWhere({ assigned_ws_account_id });
  const toRemove = await q.select('id', 'phone', 'dnd', 'opted_in');
  if (dryRun) {
    return { would_remove: toRemove.length, samples: toRemove.slice(0, 5) };
  }
  const ids = toRemove.map(c => c.id);
  if (ids.length) {
    await db('contacts').whereIn('id', ids).del();
  }
  return { removed: toRemove.length, phones: toRemove.map(c => c.phone) };
}

export async function cleanContactsForBadAccounts(dryRun = true) {
  // Find ws_accounts that are not usable
  const badAccounts = await db('ws_accounts')
    .whereIn('status', ['error', 'banned', 'pending_verification'])  // adjust criteria
    .select('id');
  const results = [];
  for (const acc of badAccounts) {
    const contacts = await db('contacts').where({ assigned_ws_account_id: acc.id }).select('id', 'phone');
    if (dryRun) {
      results.push({ account: acc.id, would_remove: contacts.length, samples: contacts.slice(0,3) });
    } else {
      if (contacts.length) {
        await db('contacts').whereIn('id', contacts.map(c => c.id)).del();
      }
      results.push({ account: acc.id, removed: contacts.length });
    }
  }
  return results;
}

export default { listContacts, createContact, importContacts, cleanNonUsableContacts };
