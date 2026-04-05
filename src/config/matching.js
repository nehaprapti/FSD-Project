const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const MATCHING_CONFIG = {
  searchRadiusKm: toNumber(process.env.MATCHING_SEARCH_RADIUS_KM, 5),
  noDriverTimeoutSec: toNumber(process.env.MATCHING_NO_DRIVER_TIMEOUT_SEC, 20),
  maxCandidates: Math.max(1, toNumber(process.env.MATCHING_MAX_CANDIDATES, 10))
};

// Shared-ride defaults
MATCHING_CONFIG.sharedPickupMaxKm = toNumber(process.env.SHARED_PICKUP_MAX_KM, 2);
MATCHING_CONFIG.sharedDropMaxKm = toNumber(process.env.SHARED_DROP_MAX_KM, 3);
MATCHING_CONFIG.maxSharedGroupSeats = Math.max(2, toNumber(process.env.MAX_SHARED_GROUP_SEATS, 4));

export default MATCHING_CONFIG;
