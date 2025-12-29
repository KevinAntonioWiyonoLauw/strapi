'use strict';

module.exports = {
  async up(knex) {
    const mainTable = 'alumnis';
    const newColumn = 'jejaring_alumni_officer_ready';

    const componentTable = 'components_sections_jejarings';
    const componentValueColumn = 'alumni_officer_ready';
    const mainFkColumn = 'jejaring_id';

    const hasMain = await knex.schema.hasTable(mainTable);
    if (!hasMain) return;

    const hasNewCol = await knex.schema.hasColumn(mainTable, newColumn);
    if (!hasNewCol) {
      await knex.schema.table(mainTable, (t) => {
        t.string(newColumn);
      });
    }

    const hasMainFk = await knex.schema.hasColumn(mainTable, mainFkColumn);
    const hasComponent = await knex.schema.hasTable(componentTable);
    const hasComponentValue = hasComponent
      ? await knex.schema.hasColumn(componentTable, componentValueColumn)
      : false;

    // Backfill from component table when possible.
    if (hasMainFk && hasComponent && hasComponentValue) {
      // Use raw SQL for efficiency; safe because identifiers are static.
      await knex.raw(
        `UPDATE "${mainTable}" a
         SET "${newColumn}" = c."${componentValueColumn}"
         FROM "${componentTable}" c
         WHERE a."${mainFkColumn}" = c.id
           AND (a."${newColumn}" IS NULL OR a."${newColumn}" = '')`
      );
    }

    // Default any remaining nulls.
    await knex(mainTable)
      .whereNull(newColumn)
      .update({ [newColumn]: 'tidak' });
  },

  async down(knex) {
    const mainTable = 'alumnis';
    const newColumn = 'jejaring_alumni_officer_ready';

    const hasMain = await knex.schema.hasTable(mainTable);
    if (!hasMain) return;

    const hasNewCol = await knex.schema.hasColumn(mainTable, newColumn);
    if (!hasNewCol) return;

    await knex.schema.table(mainTable, (t) => {
      t.dropColumn(newColumn);
    });
  },
};
