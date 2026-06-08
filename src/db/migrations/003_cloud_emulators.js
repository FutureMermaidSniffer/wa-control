/**
 * Cloud emulator / device session metadata storage.
 * Allows tracking Waydroid (or other Android emulator) instances used for
 * phone-less registration and linking.
 *
 * Each emulator is tied to a ws_account for the "primary" device simulation.
 */
export async function up(knex) {
  await knex.schema.createTable('cloud_emulators', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('ws_account_id')
      .references('id')
      .inTable('ws_accounts')
      .onDelete('CASCADE')
      .unique(); // one primary emulator per account (can be relaxed later)

    t.string('provider').notNullable().defaultTo('waydroid'); // waydroid, android_x86, anbox, managed_cloud, etc.
    t.string('host'); // hostname or IP of the emulator host (can be same as wa-control or remote)
    t.string('session_name'); // e.g. waydroid session id or container name
    t.string('container_id'); // docker / lxc / qemu id if applicable
    t.enum('status', [
      'provisioning',
      'starting',
      'running',
      'registered',      // WhatsApp installed + number registered
      'linking',         // pairing code flow in progress
      'linked',          // successfully linked to Baileys, emulator can be stopped
      'stopped',
      'error'
    ]).defaultTo('provisioning');

    t.jsonb('metadata'); // flexible: { display: 'wayland-0', ip: '10.x.x.x', last_step: '...', virtual_number: '...', emulator_version: '...' }
    t.text('notes');

    t.timestamp('last_started_at');
    t.timestamp('last_linked_at');
    t.timestamps(true, true);
  });

  await knex.raw('CREATE INDEX idx_cloud_emulators_account ON cloud_emulators(ws_account_id)');
  await knex.raw('CREATE INDEX idx_cloud_emulators_status ON cloud_emulators(status)');
  await knex.raw('CREATE INDEX idx_cloud_emulators_provider ON cloud_emulators(provider)');
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('cloud_emulators');
}
