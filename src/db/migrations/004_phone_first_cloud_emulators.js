/**
 * Allow phone-first acquisition for virtual numbers (GrizzlySMS etc.) before full ws_account is created.
 * This enables transitional state: acquire number -> cloud_emulator record (phone only) ->
 * provisioning/linking -> only on successful Baileys 'open' do we create full ws_account + allocate port.
 *
 * Makes ws_account_id nullable so we can track numbers that are acquired/registered in emulator
 * but not yet promoted to operational ws_account (port allocation happens on success).
 */
export async function up(knex) {
  // Make ws_account_id nullable (was NOT NULL)
  await knex.schema.alterTable('cloud_emulators', (t) => {
    t.uuid('ws_account_id').nullable().alter();
    // Drop the old unique constraint if it was enforcing one-per-account strictly
    // (we'll allow multiple transitional records per phone or one active)
  });

  // Add phone column for phone-first flows (the number we got from SMS provider)
  await knex.schema.alterTable('cloud_emulators', (t) => {
    t.string('phone'); // e.g. +447700900123
    t.index('phone', 'idx_cloud_emulators_phone');
  });

  // Optional: allow multiple emulator records while in transitional state
  // (the previous .unique() on ws_account_id is relaxed by making nullable)
  // Add index for common queries on transitional numbers
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_cloud_emulators_phone_status ON cloud_emulators(phone, status)');

  // Seed comment: existing records with ws_account_id will continue to work.
}

export async function down(knex) {
  await knex.schema.alterTable('cloud_emulators', (t) => {
    t.dropIndex('phone', 'idx_cloud_emulators_phone');
    t.dropColumn('phone');
    t.uuid('ws_account_id').notNullable().alter(); // revert (may fail if data has nulls)
  });
  await knex.raw('DROP INDEX IF EXISTS idx_cloud_emulators_phone_status');
}
