/**
 * LID ↔ phone identity map + message delivery_status + conversation.contact_lid
 */
export async function up(knex) {
  await knex.schema.createTable('contact_identities', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('ws_account_id').references('id').inTable('ws_accounts').onDelete('CASCADE').notNullable();
    t.string('phone'); // E.164 digits when known
    t.string('lid'); // LID user part when known
    t.string('push_name');
    t.timestamps(true, true);
  });

  // Partial uniques so multiple nulls are allowed per column
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS contact_identities_account_phone_uidx
    ON contact_identities (ws_account_id, phone)
    WHERE phone IS NOT NULL
  `);
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS contact_identities_account_lid_uidx
    ON contact_identities (ws_account_id, lid)
    WHERE lid IS NOT NULL
  `);
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS contact_identities_account_idx
    ON contact_identities (ws_account_id)
  `);

  await knex.schema.alterTable('conversations', (t) => {
    t.string('contact_lid').nullable();
  });
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS conversations_account_lid_idx
    ON conversations (ws_account_id, contact_lid)
    WHERE contact_lid IS NOT NULL
  `);

  await knex.schema.alterTable('messages', (t) => {
    t.string('delivery_status').defaultTo('pending'); // pending|server_ack|delivered|read|played|failed
    t.timestamp('status_updated_at').nullable();
  });
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS messages_wa_message_id_idx
    ON messages (wa_message_id)
    WHERE wa_message_id IS NOT NULL
  `);
}

export async function down(knex) {
  await knex.raw('DROP INDEX IF EXISTS messages_wa_message_id_idx');
  await knex.schema.alterTable('messages', (t) => {
    t.dropColumn('delivery_status');
    t.dropColumn('status_updated_at');
  });
  await knex.raw('DROP INDEX IF EXISTS conversations_account_lid_idx');
  await knex.schema.alterTable('conversations', (t) => {
    t.dropColumn('contact_lid');
  });
  await knex.raw('DROP INDEX IF EXISTS contact_identities_account_idx');
  await knex.raw('DROP INDEX IF EXISTS contact_identities_account_lid_uidx');
  await knex.raw('DROP INDEX IF EXISTS contact_identities_account_phone_uidx');
  await knex.schema.dropTableIfExists('contact_identities');
}
