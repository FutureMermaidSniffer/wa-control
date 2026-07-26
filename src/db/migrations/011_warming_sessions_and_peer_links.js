/**
 * Warming calendar sessions + peer contact-save longevity links.
 * - warming_tasks: track intra-day session progress for real multi-session days
 * - warming_peer_links: first-message mutual contact save between pool peers
 */
export async function up(knex) {
  await knex.schema.alterTable('warming_tasks', (t) => {
    t.integer('sessions_completed_today').notNullable().defaultTo(0);
    t.timestamp('current_day_started_at', { useTz: true });
    t.timestamp('last_session_at', { useTz: true });
    t.integer('sessions_per_day'); // optional override; null = derive from mode/target
  });

  await knex.schema.createTable('warming_peer_links', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('from_account_id').notNullable().references('id').inTable('ws_accounts').onDelete('CASCADE');
    t.uuid('to_account_id').notNullable().references('id').inTable('ws_accounts').onDelete('CASCADE');
    t.timestamp('from_saved_at', { useTz: true });
    t.timestamp('to_saved_at', { useTz: true });
    t.timestamp('first_message_at', { useTz: true });
    t.timestamp('reciprocal_message_at', { useTz: true });
    t.string('status', 32).notNullable().defaultTo('pending'); // pending | introduced | failed
    t.integer('retry_count').notNullable().defaultTo(0);
    t.text('last_error');
    t.timestamps(true, true);
    t.unique(['from_account_id', 'to_account_id']);
  });

  await knex.raw('CREATE INDEX IF NOT EXISTS idx_warming_peer_links_to_status ON warming_peer_links(to_account_id, status)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_warming_peer_links_from ON warming_peer_links(from_account_id)');
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('warming_peer_links');
  await knex.schema.alterTable('warming_tasks', (t) => {
    t.dropColumn('sessions_completed_today');
    t.dropColumn('current_day_started_at');
    t.dropColumn('last_session_at');
    t.dropColumn('sessions_per_day');
  });
}
