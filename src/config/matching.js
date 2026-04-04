const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const MATCHING_CONFIG = {
  searchRadiusKm: toNumber(process.env.MATCHING_SEARCH_RADIUS_KM, 5),
  noDriverTimeoutSec: toNumber(process.env.MATCHING_NO_DRIVER_TIMEOUT_SEC, 20),
  maxCandidates: Math.max(1, toNumber(process.env.MATCHING_MAX_CANDIDATES, 10))
};

export default MATCHING_CONFIG;
