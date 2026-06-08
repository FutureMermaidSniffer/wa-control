import db from '../db/connection.js';

export async function listPorts(filters = {}) {
  let q = db('ports').select('*').orderBy('created_at', 'desc');
  if (filters.status) q = q.where('status', filters.status);
  return q;
}

export async function getPortById(id) {
  return db('ports').where({ id }).first();
}

export async function createPort(data) {
  const [row] = await db('ports').insert(data).returning('*');
  return row;
}

export async function incrementAssigned(portId, delta = 1) {
  if (!portId) return;
  await db('ports')
    .where({ id: portId })
    .increment('numbers_assigned', delta)
    .update({ updated_at: db.fn.now() });
}

export async function decrementAssigned(portId, delta = 1) {
  if (!portId) return;
  await db('ports')
    .where({ id: portId })
    .decrement('numbers_assigned', delta)
    .update({ updated_at: db.fn.now() });
}

export default { listPorts, getPortById, createPort, incrementAssigned, decrementAssigned };
