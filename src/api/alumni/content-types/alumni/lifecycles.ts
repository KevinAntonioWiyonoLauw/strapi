const computeOfficerReady = (entry: any) => entry?.jejaring?.alumniOfficerReady ?? 'tidak';

const setDerivedOfficerReadyFromPayload = (data: any) => {
  if (!data || typeof data !== 'object') return false;

  // Only sync when the component payload is present and explicitly includes alumniOfficerReady.
  if (!data.jejaring || typeof data.jejaring !== 'object') return false;
  if (!Object.prototype.hasOwnProperty.call(data.jejaring, 'alumniOfficerReady')) return false;

  data.jejaringAlumniOfficerReady = data.jejaring.alumniOfficerReady ?? 'tidak';
  return true;
};

const setDerivedOfficerReadyFromDb = async (event: any) => {
  const where = event?.params?.where;
  if (!where || typeof where !== 'object') return;

  const alumniQuery = strapi.db.query('api::alumni.alumni');
  const existing = await alumniQuery.findOne({
    where,
    populate: { jejaring: true },
  });

  if (!existing) return;

  event.params.data.jejaringAlumniOfficerReady = computeOfficerReady(existing);
};

export default {
  beforeCreate(event: any) {
    setDerivedOfficerReadyFromPayload(event.params.data);
  },

  async beforeUpdate(event: any) {
    const didSyncFromPayload = setDerivedOfficerReadyFromPayload(event.params.data);

    // If update payload doesn't include jejaring.alumniOfficerReady, keep derived field consistent
    // by reading the current value from DB.
    if (!didSyncFromPayload && event?.params?.data) {
      if (event.params.data.jejaringAlumniOfficerReady == null) {
        await setDerivedOfficerReadyFromDb(event);
      }
    }
  },
};