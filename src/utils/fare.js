const round2 = (value) => Math.round(value * 100) / 100;

export const calculateFare = ({
  distanceKm,
  durationMin,
  baseFare = 40,
  perKmRate = 12,
  perMinRate = 2,
  surgeMultiplier = 1
}) => {
  const rawFare = baseFare + distanceKm * perKmRate + durationMin * perMinRate;
  return round2(rawFare * surgeMultiplier);
};
