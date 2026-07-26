/**
 * Expand materials.type check to allow about/status/audio (used by profile pools + warming).
 */
export async function up(knex) {
  await knex.raw('ALTER TABLE materials DROP CONSTRAINT IF EXISTS materials_type_check');
  await knex.raw(`
    ALTER TABLE materials
    ADD CONSTRAINT materials_type_check
    CHECK (type = ANY (ARRAY[
      'avatar'::text,
      'nickname'::text,
      'message'::text,
      'about'::text,
      'status'::text,
      'audio'::text
    ]))
  `);
}

export async function down(knex) {
  await knex.raw('ALTER TABLE materials DROP CONSTRAINT IF EXISTS materials_type_check');
  await knex.raw(`
    ALTER TABLE materials
    ADD CONSTRAINT materials_type_check
    CHECK (type = ANY (ARRAY['avatar'::text, 'nickname'::text, 'message'::text]))
  `);
}
