const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

export const encodeGeohash = (lat, lng, precision = 8) => {
  let latRange = [-90, 90];
  let lngRange = [-180, 180];
  let isEvenBit = true;
  let bit = 0;
  let charIndex = 0;
  let geohash = "";

  while (geohash.length < precision) {
    if (isEvenBit) {
      const mid = (lngRange[0] + lngRange[1]) / 2;
      if (lng > mid) {
        charIndex = (charIndex << 1) + 1;
        lngRange[0] = mid;
      } else {
        charIndex = (charIndex << 1) + 0;
        lngRange[1] = mid;
      }
    } else {
      const mid = (latRange[0] + latRange[1]) / 2;
      if (lat > mid) {
        charIndex = (charIndex << 1) + 1;
        latRange[0] = mid;
      } else {
        charIndex = (charIndex << 1) + 0;
        latRange[1] = mid;
      }
    }

    isEvenBit = !isEvenBit;

    if (++bit === 5) {
      geohash += BASE32[charIndex];
      bit = 0;
      charIndex = 0;
    }
  }

  return geohash;
};
