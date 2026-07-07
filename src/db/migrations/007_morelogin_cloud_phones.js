/**
 * MoreLogin cloud phone integration.
 * - Add morelogin_id (the remote cloud phone id from MoreLogin)
 * - Add provider distinction
 * - Extend status for new lifecycle (powering, installing, awaiting_code, etc.)
 * - Store proxy assignment and last actions for cost/audit control
 */

export async function up(knex) {
  // Add columns
  await knex.schema.alterTable('cloud_emulators', (t) => {
    t.string('morelogin_id'); // remote id e.g. 1711663173256058
    t.string('provider').defaultTo('morelogin').alter(); // change default from waydroid
    t.index('morelogin_id', 'idx_cloud_emulators_morelogin_id');
  });

  // Optional: extend enum if your PG allows (we use text/enum loosely)
  // Add useful metadata fields we will populate
  // (already have jsonb metadata, so just document convention)

  // Convention in metadata for MoreLogin rows:
  // {
  //   morelogin: { skuId, envStatus, proxyId, androidId, adbEnabled, lastPowerOn, ... },
  //   registration: { phoneEntered: true, codeSubmittedAt, waVersionCode, ... },
  //   ...
  // }

  console.log('Migration 007: morelogin_id + provider default added to cloud_emulators');
}

export async function down(knex) {
  await knex.schema.alterTable('cloud_emulators', (t) => {
    t.dropIndex('morelogin_id', 'idx_cloud_emulators_morelogin_id');
    t.dropColumn('morelogin_id');
    t.string('provider').defaultTo('waydroid').alter();
  });
}
