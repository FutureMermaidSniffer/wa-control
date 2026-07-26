import db from '../db/connection.js';

export async function listWarmingTasks(filters = {}) {
  let q = db('warming_tasks as wt')
    .join('ws_accounts as wa', 'wt.ws_account_id', 'wa.id')
    .select(
      'wt.*',
      'wa.phone',
      'wa.status as account_status',
    );
  if (filters.status) q = q.where('wt.status', filters.status);
  return q.orderBy('wt.created_at', 'desc').limit(100);
}

export async function createWarmingTask(data) {
  const [row] = await db('warming_tasks').insert({
    sessions_completed_today: 0,
    ...data,
  }).returning('*');
  if (data.ws_account_id) {
    await db('ws_accounts')
      .where({ id: data.ws_account_id })
      .update({ status: 'warming', current_warming_task_id: row.id, is_in_warehouse: false });
  }
  return row;
}

export async function updateTask(id, patch) {
  return db('warming_tasks').where({ id }).update({ ...patch, updated_at: db.fn.now() });
}

export async function getTask(id) {
  return db('warming_tasks').where({ id }).first();
}

export async function listActiveTasks() {
  return db('warming_tasks')
    .whereIn('status', ['pending', 'executing'])
    .select('*');
}

export async function getAccountBrief(id) {
  return db('ws_accounts')
    .where({ id })
    .select('id', 'phone', 'display_name', 'status', 'health_score', 'daily_sent', 'warm_group_id', 'updated_at', 'current_warming_task_id')
    .first();
}

// ----- Peer longevity links -----

export async function getPeerLink(fromAccountId, toAccountId) {
  return db('warming_peer_links')
    .where({ from_account_id: fromAccountId, to_account_id: toAccountId })
    .first();
}

export async function upsertPeerLink(data) {
  const existing = await getPeerLink(data.from_account_id, data.to_account_id);
  if (existing) {
    const patch = { ...data };
    delete patch.from_account_id;
    delete patch.to_account_id;
    if (Object.keys(patch).length) {
      await db('warming_peer_links').where({ id: existing.id }).update({
        ...patch,
        updated_at: db.fn.now(),
      });
    }
    return getPeerLink(data.from_account_id, data.to_account_id);
  }
  const [row] = await db('warming_peer_links').insert({
    status: 'pending',
    retry_count: 0,
    ...data,
  }).returning('*');
  return row;
}

export async function updatePeerLink(id, patch) {
  const clean = { ...patch };
  Object.keys(clean).forEach((k) => {
    if (clean[k] === undefined) delete clean[k];
  });
  await db('warming_peer_links').where({ id }).update({
    ...clean,
    updated_at: db.fn.now(),
  });
  return db('warming_peer_links').where({ id }).first();
}

/** Links where this account is "to" and still needs reciprocal save/reply */
export async function listPendingReciprocalsFor(accountId) {
  return db('warming_peer_links')
    .where({ to_account_id: accountId })
    .where(function () {
      this.whereNull('to_saved_at')
        .orWhereNull('reciprocal_message_at')
        .orWhere('status', 'pending');
    })
    .whereNot('status', 'failed')
    .where('retry_count', '<', 5)
    .orderBy('created_at', 'asc')
    .limit(10);
}

export async function isPeerIntroduced(fromAccountId, toAccountId) {
  const link = await getPeerLink(fromAccountId, toAccountId);
  return !!(link && link.status === 'introduced' && link.first_message_at);
}

export async function listIntroducedPeerIds(fromAccountId) {
  const rows = await db('warming_peer_links')
    .where({ from_account_id: fromAccountId })
    .whereNotNull('first_message_at')
    .select('to_account_id');
  return rows.map((r) => r.to_account_id);
}

/**
 * Pick peer accounts for a warming session.
 */
export async function pickWarmingPeers(accountId, { count = 1, preferUnintroduced = true } = {}) {
  let peers = await db('warming_tasks')
    .join('ws_accounts', 'warming_tasks.ws_account_id', 'ws_accounts.id')
    .whereIn('warming_tasks.status', ['executing', 'pending', 'paused'])
    .whereIn('ws_accounts.status', ['linked', 'active', 'linking', 'offline', 'warming'])
    .whereNot('warming_tasks.ws_account_id', accountId)
    .whereNotNull('ws_accounts.phone')
    .select('ws_accounts.id', 'ws_accounts.phone', 'ws_accounts.display_name', 'ws_accounts.status')
    .limit(20);

  if (!peers.length) {
    peers = await db('ws_accounts')
      .whereIn('status', ['linked', 'active', 'warming'])
      .whereNot('id', accountId)
      .whereNotNull('phone')
      .select('id', 'phone', 'display_name', 'status')
      .limit(10);
  }

  if (!peers.length) return [];

  if (preferUnintroduced) {
    const introduced = new Set(await listIntroducedPeerIds(accountId));
    const unintroduced = peers.filter((p) => !introduced.has(p.id));
    const pool = unintroduced.length ? unintroduced : peers;
    return shuffle(pool).slice(0, count);
  }

  return shuffle(peers).slice(0, count);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default {
  listWarmingTasks,
  createWarmingTask,
  updateTask,
  getTask,
  listActiveTasks,
  getAccountBrief,
  getPeerLink,
  upsertPeerLink,
  updatePeerLink,
  listPendingReciprocalsFor,
  isPeerIntroduced,
  listIntroducedPeerIds,
  pickWarmingPeers,
};
