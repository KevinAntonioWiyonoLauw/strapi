'use strict';

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  // Sanity: ensure the underlying DB column exists.
  const knex = app.db.connection;
  const hasColumn = await knex.schema.hasColumn('alumnis', 'jejaring_alumni_officer_ready');
  if (!hasColumn) {
    console.error(
      'DB column alumnis.jejaring_alumni_officer_ready not found.\n' +
        'Strapi likely has not synced schema yet. Start Strapi once (pnpm develop) so it can create the column, then rerun this script.'
    );
    await app.destroy();
    process.exit(1);
  }

  const alumniQuery = app.db.query('api::alumni.alumni');

  const entries = await alumniQuery.findMany({
    populate: { jejaring: true },
  });

  let updated = 0;
  let updatedViaKnex = 0;

  for (const entry of entries) {
    const expected = entry?.jejaring?.alumniOfficerReady ?? 'tidak';
    if (entry.jejaringAlumniOfficerReady !== expected) {
      await alumniQuery.update({
        where: { id: entry.id },
        data: { jejaringAlumniOfficerReady: expected },
      });

      // Verify persistence; if it didn't stick, force it via raw knex.
      const row = await knex('alumnis')
        .select('jejaring_alumni_officer_ready')
        .where({ id: entry.id })
        .first();

      if ((row?.jejaring_alumni_officer_ready ?? null) !== expected) {
        await knex('alumnis').where({ id: entry.id }).update({
          jejaring_alumni_officer_ready: expected,
        });
        updatedViaKnex++;
      }

      updated++;
    }
  }

  console.log(
    `Backfill done. Updated: ${updated}/${entries.length}. Forced via knex: ${updatedViaKnex}`
  );
  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});