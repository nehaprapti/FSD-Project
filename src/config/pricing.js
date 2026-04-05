const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const PRICING_CONFIG = {
  currency: process.env.CURRENCY ?? "INR",
  baseFare: toNumber(process.env.BASE_FARE, 30),
  perKmRate: toNumber(process.env.PER_KM_RATE, 12),
  perMinuteRate: toNumber(process.env.PER_MINUTE_RATE, 2),
  averageSpeedKmph: toNumber(process.env.AVG_SPEED_KMPH, 28),
  waitingThresholdMin: toNumber(process.env.WAITING_THRESHOLD_MIN, 3),
  waitingPerMinuteRate: toNumber(process.env.WAITING_PER_MINUTE_RATE, 2),
  sharedRideDiscountPercent: toNumber(process.env.SHARED_RIDE_DISCOUNT_PERCENT, 30),
  estimateDistanceVariancePercent: toNumber(process.env.ESTIMATE_DISTANCE_VARIANCE_PERCENT, 8),
  estimateTimeVariancePercent: toNumber(process.env.ESTIMATE_TIME_VARIANCE_PERCENT, 15),
  estimateWaitingMinMin: toNumber(process.env.ESTIMATE_WAITING_MIN_MIN, 0),
  estimateWaitingMinMax: toNumber(process.env.ESTIMATE_WAITING_MIN_MAX, 6)
  ,
  commissionRatePercent: toNumber(process.env.COMMISSION_RATE_PERCENT, 20)
  ,
  sharedServiceFeePercent: toNumber(process.env.SHARED_SERVICE_FEE_PERCENT, 5)
};

export default PRICING_CONFIG;
