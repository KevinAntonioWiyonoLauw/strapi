'use strict';

module.exports = {
  async up(knex) {
    const tableName = 'components_sections_lainnyas';
    const columnName = 'suggestions';

    const hasTable = await knex.schema.hasTable(tableName);
    if (!hasTable) return;

    const hasColumn = await knex.schema.hasColumn(tableName, columnName);
    if (!hasColumn) return;

    await knex.raw(`ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" TYPE TEXT`);
  },

  async down(knex) {
    const tableName = 'components_sections_lainnyas';
    const columnName = 'suggestions';

    const hasTable = await knex.schema.hasTable(tableName);
    if (!hasTable) return;

    const hasColumn = await knex.schema.hasColumn(tableName, columnName);
    if (!hasColumn) return;

    await knex.raw(`ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" TYPE VARCHAR(255)`);
  },
};
