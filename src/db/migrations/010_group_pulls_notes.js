/**
 * group_pulls.notes was used by data layer / markFailed but never in schema.
 */
export async function up(knex) {
  const has = await knex.schema.hasColumn('group_pulls', 'notes');
  if (!has) {
    await knex.schema.alterTable('group_pulls', (t) => {
      t.text('notes').nullable();
    });
  }
}

export async function down(knex) {
  if (await knex.schema.hasColumn('group_pulls', 'notes')) {
    await knex.schema.alterTable('group_pulls', (t) => {
      t.dropColumn('notes');
    });
  }
}
