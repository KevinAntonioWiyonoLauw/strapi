const computeOfficerReady = (entry: any) => entry?.jejaring?.alumniOfficerReady ?? 'tidak';

const setDerivedFromPayloadIfPresent = (data: any) => {
  if (!data || typeof data !== 'object') return;

  const jejaring = data.jejaring;
  if (!jejaring || typeof jejaring !== 'object') return;

  if (!Object.prototype.hasOwnProperty.call(jejaring, 'alumniOfficerReady')) return;

  data.jejaringAlumniOfficerReady = jejaring.alumniOfficerReady ?? 'tidak';
};

const syncDerivedFromDbById = async (id: number) => {
  const alumniQuery = strapi.db.query('api::alumni.alumni');

  const existing = await alumniQuery.findOne({
    where: { id },
    populate: { jejaring: true },
  });

  if (!existing) return;

  const expected = computeOfficerReady(existing);

  if (existing.jejaringAlumniOfficerReady !== expected) {
    await alumniQuery.update({
      where: { id },
      data: { jejaringAlumniOfficerReady: expected },
    });
  }
};

export default {
  beforeCreate(event: any) {
    setDerivedFromPayloadIfPresent(event.params.data);
  },

  beforeUpdate(event: any) {
    setDerivedFromPayloadIfPresent(event.params.data);
  },

  async afterCreate(event: any) {
    if (event?.result?.id) {
      await syncDerivedFromDbById(event.result.id);
    }
  },

  async afterUpdate(event: any) {
    if (event?.result?.id) {
      await syncDerivedFromDbById(event.result.id);
    }
  },
};