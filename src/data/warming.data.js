import db from '../db/connection.js';

export async function listWarmingTasks(filters = {}) {
  let q = db('warming_tasks as wt')
    .join('ws_accounts as wa', 'wt.ws_account_id', 'wa.id')
    .select('wt.*', 'wa.phone', 'wa.status as account_status');
  if (filters.status) q = q.where('wt.status', filters.status);
  return q.orderBy('wt.created_at', 'desc').limit(100);
}

export async function createWarmingTask(data) {
  const [row] = await db('warming_tasks').insert(data).returning('*');
  // link back to account
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

export default { listWarmingTasks, createWarmingTask, updateTask, getTask };
