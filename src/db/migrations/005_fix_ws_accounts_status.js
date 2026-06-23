/**
 * Add 'pending_verification' to the allowed statuses for ws_accounts.
 * This is used for phone-first/cloud flows where we create the account
 * before the actual Baileys link succeeds.
 */
export async function up(knex) {
  await knex.raw(`
    ALTER TABLE ws_accounts
      DROP CONSTRAINT IF EXISTS ws_accounts_status_check;

    ALTER TABLE ws_accounts
      ADD CONSTRAINT ws_accounts_status_check
      CHECK (status IN (
        'active', 'warming', 'warehouse', 'offline', 'error', 'banned',
        'pending_login', 'pending_verification'
      ));
  `);
}

export async function down(knex) {
  await knex.raw(`
    ALTER TABLE ws_accounts
      DROP CONSTRAINT IF EXISTS ws_accounts_status_check;

    ALTER TABLE ws_accounts
      ADD CONSTRAINT ws_accounts_status_check
      CHECK (status IN (
        'active', 'warming', 'warehouse', 'offline', 'error', 'banned',
        'pending_login'
      ));
  `);
}
