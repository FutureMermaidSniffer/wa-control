import db from '../db/connection.js';

function countByType(materials) {
  const counts = { nickname: 0, avatar: 0, about: 0, status: 0, message: 0, audio: 0, other: 0 };
  for (const m of materials || []) {
    const t = m.type || 'other';
    if (counts[t] != null) counts[t] += 1;
    else counts.other += 1;
  }
  // treat status as about for UI
  counts.about = (counts.about || 0) + (counts.status || 0);
  return counts;
}

export async function listPools() {
  const pools = await db('profile_pools').select('*').orderBy('created_at', 'desc');
  if (!pools.length) return [];

  const ids = pools.map((p) => p.id);
  const items = await db('profile_pool_items as ppi')
    .join('materials as m', 'm.id', 'ppi.material_id')
    .whereIn('ppi.pool_id', ids)
    .select('ppi.pool_id', 'm.id', 'm.type', 'm.is_active');

  const byPool = new Map();
  for (const it of items) {
    if (!byPool.has(it.pool_id)) byPool.set(it.pool_id, []);
    byPool.get(it.pool_id).push(it);
  }

  return pools.map((p) => {
    const mats = byPool.get(p.id) || [];
    const counts = countByType(mats);
    return {
      ...p,
      item_count: mats.length,
      counts,
    };
  });
}

export async function getPool(id) {
  const pool = await db('profile_pools').where({ id }).first();
  if (!pool) return null;
  const materials = await db('profile_pool_items as ppi')
    .join('materials as m', 'm.id', 'ppi.material_id')
    .where('ppi.pool_id', id)
    .select('m.*', 'ppi.sort_order', 'ppi.id as pool_item_id')
    .orderBy('ppi.sort_order', 'asc')
    .orderBy('m.created_at', 'desc');
  return {
    ...pool,
    materials,
    item_count: materials.length,
    counts: countByType(materials),
  };
}

export async function createPool(data) {
  return db.transaction(async (trx) => {
    if (data.is_default) {
      await trx('profile_pools').update({ is_default: false });
    }
    const [row] = await trx('profile_pools')
      .insert({
        name: data.name,
        description: data.description || null,
        is_default: !!data.is_default,
        is_active: data.is_active !== false,
        created_by: data.created_by || null,
      })
      .returning('*');
    return row;
  });
}

export async function updatePool(id, patch) {
  return db.transaction(async (trx) => {
    if (patch.is_default === true) {
      await trx('profile_pools').update({ is_default: false });
    }
    const clean = { ...patch };
    Object.keys(clean).forEach((k) => {
      if (clean[k] === undefined) delete clean[k];
    });
    await trx('profile_pools').where({ id }).update({ ...clean, updated_at: db.fn.now() });
    return trx('profile_pools').where({ id }).first();
  });
}

export async function setDefaultPool(id) {
  return db.transaction(async (trx) => {
    const pool = await trx('profile_pools').where({ id }).first();
    if (!pool) return null;
    await trx('profile_pools').update({ is_default: false });
    await trx('profile_pools').where({ id }).update({
      is_default: true,
      is_active: true,
      updated_at: db.fn.now(),
    });
    return trx('profile_pools').where({ id }).first();
  });
}

export async function deletePool(id) {
  const pool = await db('profile_pools').where({ id }).first();
  if (!pool) return { deleted: false };
  if (pool.is_default) {
    const others = await db('profile_pools').whereNot({ id }).where({ is_active: true }).first();
    if (others) {
      await setDefaultPool(others.id);
    }
  }
  await db('profile_pools').where({ id }).del();
  return { deleted: true };
}

export async function addItems(poolId, materialIds = []) {
  const ids = [...new Set((materialIds || []).filter(Boolean))];
  if (!ids.length) return { added: 0 };
  let added = 0;
  for (const mid of ids) {
    try {
      await db('profile_pool_items')
        .insert({ pool_id: poolId, material_id: mid })
        .onConflict(['pool_id', 'material_id'])
        .ignore();
      added += 1;
    } catch {
      /* ignore dup / missing */
    }
  }
  return { added, material_ids: ids };
}

export async function removeItem(poolId, materialId) {
  const n = await db('profile_pool_items')
    .where({ pool_id: poolId, material_id: materialId })
    .del();
  return { removed: n };
}

/** Default active pool with materials (for warming). */
export async function getDefaultPoolWithMaterials() {
  let pool = await db('profile_pools')
    .where({ is_default: true, is_active: true })
    .first();
  if (!pool) {
    pool = await db('profile_pools').where({ is_active: true }).orderBy('created_at', 'asc').first();
  }
  if (!pool) return null;
  return getPool(pool.id);
}

export async function getPoolMaterialsByType(poolId, type) {
  const types = type === 'about' || type === 'status'
    ? ['about', 'status']
    : [type];
  return db('profile_pool_items as ppi')
    .join('materials as m', 'm.id', 'ppi.material_id')
    .where('ppi.pool_id', poolId)
    .whereIn('m.type', types)
    .where('m.is_active', true)
    .select('m.*')
    .orderBy('ppi.sort_order', 'asc');
}

/**
 * Active materials of a type: prefer default pool, else global library.
 */
export async function pickMaterialsForWarming(type, { poolId } = {}) {
  let pool = null;
  if (poolId) {
    pool = await db('profile_pools').where({ id: poolId, is_active: true }).first();
  }
  if (!pool) {
    const def = await getDefaultPoolWithMaterials();
    pool = def;
  }

  if (pool?.id) {
    const fromPool = await getPoolMaterialsByType(pool.id, type);
    if (fromPool.length) {
      return { materials: fromPool, poolId: pool.id, source: 'pool' };
    }
  }

  const types = type === 'about' || type === 'status'
    ? ['about', 'status']
    : [type];
  const global = await db('materials')
    .whereIn('type', types)
    .where('is_active', true)
    .select('*');
  return { materials: global, poolId: pool?.id || null, source: 'global' };
}

export function pickRandom(materials) {
  if (!materials?.length) return null;
  return materials[Math.floor(Math.random() * materials.length)];
}

export default {
  listPools,
  getPool,
  createPool,
  updatePool,
  setDefaultPool,
  deletePool,
  addItems,
  removeItem,
  getDefaultPoolWithMaterials,
  getPoolMaterialsByType,
  pickMaterialsForWarming,
  pickRandom,
};
