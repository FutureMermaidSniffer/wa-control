/**
 * Add explicit stages for ws_accounts to better separate primary registration
 * (cloud phone) from companion linking (Baileys handshake).
 *
 * New statuses:
 * - primary_registered: WhatsApp primary registered (on phone or in cloud), ready for companion linking.
 * - linking: companion handshake in progress.
 * - linked: successfully linked (can map to active).
 *
 * This matches Rocket's separation of primary reg vs linking.
 */
export async function up(knex) {
  await knex.raw(`
    ALTER TABLE ws_accounts
      DROP CONSTRAINT IF EXISTS ws_accounts_status_check;

    ALTER TABLE ws_accounts
      ADD CONSTRAINT ws_accounts_status_check
      CHECK (status IN (
        'active', 'warming', 'warehouse', 'offline', 'error', 'banned',
        'pending_login', 'pending_verification',
        'primary_registered', 'linking', 'linked'
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
        'pending_login', 'pending_verification'
      ));
  `);
}
