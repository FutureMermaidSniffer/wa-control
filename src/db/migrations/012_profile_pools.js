/**
 * Profile pools: curated nickname/avatar/about materials used by warming.
 * materials: soft-disable + notes; edit remains on materials table.
 */
export async function up(knex) {
  await knex.schema.alterTable('materials', (t) => {
    t.boolean('is_active').notNullable().defaultTo(true);
    t.text('notes');
  });

  await knex.schema.createTable('profile_pools', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name').notNullable();
    t.text('description');
    t.boolean('is_default').notNullable().defaultTo(false);
    t.boolean('is_active').notNullable().defaultTo(true);
    t.uuid('created_by');
    t.timestamps(true, true);
  });

  await knex.schema.createTable('profile_pool_items', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('pool_id').notNullable().references('id').inTable('profile_pools').onDelete('CASCADE');
    t.uuid('material_id').notNullable().references('id').inTable('materials').onDelete('CASCADE');
    t.integer('sort_order').notNullable().defaultTo(0);
    t.timestamps(true, true);
    t.unique(['pool_id', 'material_id']);
  });

  await knex.raw('CREATE INDEX IF NOT EXISTS idx_profile_pools_default ON profile_pools(is_default) WHERE is_default = true');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_profile_pool_items_pool ON profile_pool_items(pool_id)');

  // Seed default pool; attach any existing materials
  const [pool] = await knex('profile_pools')
    .insert({
      name: 'Default Profile Pool',
      description: 'Warming draws nicknames, avatars, and About text from this pool when set as default.',
      is_default: true,
      is_active: true,
    })
    .returning('*');

  const mats = await knex('materials').select('id');
  if (mats.length && pool?.id) {
    await knex('profile_pool_items').insert(
      mats.map((m, i) => ({
        pool_id: pool.id,
        material_id: m.id,
        sort_order: i,
      })),
    );
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('profile_pool_items');
  await knex.schema.dropTableIfExists('profile_pools');
  await knex.schema.alterTable('materials', (t) => {
    t.dropColumn('is_active');
    t.dropColumn('notes');
  });
}
