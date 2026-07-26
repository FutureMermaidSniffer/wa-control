import db from '../db/connection.js';

export async function listMaterials(filters = {}) {
  let q = db('materials').select('materials.*').orderBy('materials.created_at', 'desc');

  if (filters.type) q = q.where('materials.type', filters.type);
  if (filters.active === true || filters.active === 'true') {
    q = q.where('materials.is_active', true);
  } else if (filters.active === false || filters.active === 'false') {
    q = q.where('materials.is_active', false);
  }
  if (filters.pool_id) {
    q = q
      .join('profile_pool_items as ppi', 'ppi.material_id', 'materials.id')
      .where('ppi.pool_id', filters.pool_id)
      .orderBy('ppi.sort_order', 'asc');
  }
  return q.limit(filters.limit || 500);
}

export async function getMaterial(id) {
  return db('materials').where({ id }).first();
}

export async function createMaterial(data) {
  const [row] = await db('materials').insert(data).returning('*');
  return row;
}

export async function updateMaterial(id, patch) {
  const clean = { ...patch };
  Object.keys(clean).forEach((k) => {
    if (clean[k] === undefined) delete clean[k];
  });
  await db('materials').where({ id }).update({ ...clean, updated_at: db.fn.now() });
  return getMaterial(id);
}

export async function deleteMaterial(id) {
  return db('materials').where({ id }).del();
}

export async function bumpUsage(id) {
  if (!id) return;
  await db('materials')
    .where({ id })
    .update({
      usage_count: db.raw('COALESCE(usage_count, 0) + 1'),
      updated_at: db.fn.now(),
    })
    .catch(() => {});
}

export default {
  listMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  bumpUsage,
};
