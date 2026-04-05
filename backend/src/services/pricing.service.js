import { calculateDistanceKm } from "../utils/distance.js";
import { encodeGeohash } from "../utils/geohash.js";
import Ride from "../models/ride.model.js";
import DemandZone from "../models/demandZone.model.js";
import LocationLog from "../models/locationLog.model.js";
import PRICING_CONFIG from "../config/pricing.js";

const round2 = (value) => Math.round(value * 100) / 100;

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeLatLng = (point, label) => {
  if (!point || !Number.isFinite(Number(point.lat)) || !Number.isFinite(Number(point.lng))) {
    throw makeError(`${label} must include numeric lat and lng`, 400);
  }

  return {
    lat: Number(point.lat),
    lng: Number(point.lng)
  };
};

const toLatLngFromGeoPoint = (geoPoint) => ({
  lat: Number(geoPoint.coordinates[1]),
  lng: Number(geoPoint.coordinates[0])
});

const getCurrentSurgeMultiplier = async (areaCode, atTime = new Date()) => {
  // areaCode here is a geohash (precision 6). Demand zones are stored per time slot and day.
  const hour = atTime.getHours();
  const day = atTime.getDay();

  const dz = await DemandZone.findOne({ zoneId: areaCode, timeSlot: hour, dayOfWeek: day }).sort({ updatedAt: -1 });
  return round2(Number(dz?.surgeMultiplier || dz?.multiplier || 1));
};

const buildFareBreakdown = ({
  distanceKm,
  durationMin,
  waitingMinutes,
  surgeMultiplier,
  rideType
}) => {
  const distanceFare = distanceKm * PRICING_CONFIG.perKmRate;
  const timeFare = durationMin * PRICING_CONFIG.perMinuteRate;
  const chargeableWaitingMin = Math.max(0, waitingMinutes - PRICING_CONFIG.waitingThresholdMin);
  const waitingCharge = chargeableWaitingMin * PRICING_CONFIG.waitingPerMinuteRate;

  const subtotalBeforeSurge = PRICING_CONFIG.baseFare + distanceFare + timeFare + waitingCharge;
  const surgeAmount = subtotalBeforeSurge * Math.max(0, surgeMultiplier - 1);
  const totalBeforeDiscount = subtotalBeforeSurge * surgeMultiplier;

  const discountPercent = rideType === "shared" ? PRICING_CONFIG.sharedRideDiscountPercent : 0;
  const rideTypeDiscount = totalBeforeDiscount * (discountPercent / 100);
  const totalFare = Math.max(0, totalBeforeDiscount - rideTypeDiscount);

  return {
    baseFare: round2(PRICING_CONFIG.baseFare),
    distanceFare: round2(distanceFare),
    timeFare: round2(timeFare),
    waitingCharge: round2(waitingCharge),
    surgeMultiplier: round2(surgeMultiplier),
    surgeAmount: round2(surgeAmount),
    rideTypeDiscount: round2(rideTypeDiscount),
    subtotalBeforeSurge: round2(subtotalBeforeSurge),
    totalBeforeDiscount: round2(totalBeforeDiscount),
    totalFare: round2(totalFare)
  };
};

const calculateDistanceFromLogs = (logs) => {
  let distanceKm = 0;

  for (let i = 1; i < logs.length; i += 1) {
    const from = toLatLngFromGeoPoint(logs[i - 1].location);
    const to = toLatLngFromGeoPoint(logs[i].location);
    distanceKm += calculateDistanceKm(from, to);
  }

  return distanceKm;
};

const calculateWaitingMinutes = (logs) => {
  const arrivedLog = logs.find((log) => log.eventType === "arrived_pickup");
  const startLog = logs.find((log) => log.eventType === "trip_started");

  if (!arrivedLog || !startLog || startLog.timestamp <= arrivedLog.timestamp) {
    return 0;
  }

  return (new Date(startLog.timestamp).getTime() - new Date(arrivedLog.timestamp).getTime()) / 60000;
};

export const estimateFare = async (pickupCoords, dropCoords, rideType = "solo") => {
  const pickup = normalizeLatLng(pickupCoords, "pickupCoords");
  const drop = normalizeLatLng(dropCoords, "dropCoords");

  const requestedRideType = rideType === "shared" ? "shared" : "solo";
  const areaCode = encodeGeohash(pickup.lat, pickup.lng, 6);
  const surgeMultiplier = await getCurrentSurgeMultiplier(areaCode, new Date());

  const baseDistanceKm = calculateDistanceKm(pickup, drop);

  const minDistanceKm = Math.max(0.1, baseDistanceKm * (1 - PRICING_CONFIG.estimateDistanceVariancePercent / 100));
  const maxDistanceKm = baseDistanceKm * (1 + PRICING_CONFIG.estimateDistanceVariancePercent / 100);

  const baseDurationMin = (baseDistanceKm / PRICING_CONFIG.averageSpeedKmph) * 60;
  const minDurationMin = Math.max(1, baseDurationMin * (1 - PRICING_CONFIG.estimateTimeVariancePercent / 100));
  const maxDurationMin = baseDurationMin * (1 + PRICING_CONFIG.estimateTimeVariancePercent / 100);

  const minBreakdown = buildFareBreakdown({
    distanceKm: minDistanceKm,
    durationMin: minDurationMin,
    waitingMinutes: PRICING_CONFIG.estimateWaitingMinMin,
    surgeMultiplier,
    rideType: requestedRideType
  });

  const maxBreakdown = buildFareBreakdown({
    distanceKm: maxDistanceKm,
    durationMin: maxDurationMin,
    waitingMinutes: PRICING_CONFIG.estimateWaitingMinMax,
    surgeMultiplier,
    rideType: requestedRideType
  });

  return {
    currency: PRICING_CONFIG.currency,
    rideType: requestedRideType,
    areaCode,
    surgeMultiplier,
    assumptions: {
      averageSpeedKmph: PRICING_CONFIG.averageSpeedKmph,
      waitingThresholdMin: PRICING_CONFIG.waitingThresholdMin,
      sharedRideDiscountPercent: requestedRideType === "shared" ? PRICING_CONFIG.sharedRideDiscountPercent : 0
    },
    distanceKm: {
      min: round2(minDistanceKm),
      max: round2(maxDistanceKm)
    },
    durationMin: {
      min: round2(minDurationMin),
      max: round2(maxDurationMin)
    },
    waitingMinutes: {
      min: PRICING_CONFIG.estimateWaitingMinMin,
      max: PRICING_CONFIG.estimateWaitingMinMax
    },
    estimate: {
      min: minBreakdown.totalFare,
      max: maxBreakdown.totalFare
    },
    breakdown: {
      min: minBreakdown,
      max: maxBreakdown
    }
  };
};

export const calculateFinalFare = async (rideId) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw makeError("Ride not found", 404);
  }

  const logs = await LocationLog.find({ rideId: ride._id }).sort({ timestamp: 1 });
  if (logs.length < 2) {
    throw makeError("At least two LocationLogs are required to calculate final fare", 400);
  }

  const firstLog = logs[0];
  const lastLog = logs[logs.length - 1];
  const actualDurationMin = Math.max(
    1,
    (new Date(lastLog.timestamp).getTime() - new Date(firstLog.timestamp).getTime()) / 60000
  );
  const actualDistanceKm = calculateDistanceFromLogs(logs);
  const waitingMinutes = calculateWaitingMinutes(logs);

  const pickup = toLatLngFromGeoPoint(ride.pickup.location);
  const areaCode = encodeGeohash(pickup.lat, pickup.lng, 6);
  const surgeMultiplier = await getCurrentSurgeMultiplier(areaCode, ride.createdAt || new Date());

  const breakdown = buildFareBreakdown({
    distanceKm: actualDistanceKm,
    durationMin: actualDurationMin,
    waitingMinutes,
    surgeMultiplier,
    rideType: ride.rideType
  });

  ride.distanceKm = round2(actualDistanceKm);
  ride.actualDurationMin = round2(actualDurationMin);
  ride.surgeMultiplier = surgeMultiplier;
  ride.finalFare = breakdown.totalFare;
  await ride.save();

  return {
    rideId: ride._id,
    currency: PRICING_CONFIG.currency,
    rideType: ride.rideType,
    areaCode,
    actualDistanceKm: round2(actualDistanceKm),
    actualDurationMin: round2(actualDurationMin),
    waitingMinutes: round2(waitingMinutes),
    breakdown
  };
};

export const estimateRideFare = async ({ pickup, drop, dropoff, rideType = "solo" }) => {
  const targetDrop = drop || dropoff;
  return estimateFare(pickup, targetDrop, rideType);
};

export const setAreaSurgeMultiplier = async ({ areaCode, multiplier, timeSlot = null, dayOfWeek = null }) => {
  if (!areaCode) {
    throw makeError("areaCode is required", 400);
  }

  if (!Number.isFinite(Number(multiplier)) || Number(multiplier) < 1) {
    throw makeError("multiplier must be a number greater than or equal to 1", 400);
  }

  const updates = [];
  const tsList = timeSlot === null ? Array.from({ length: 24 }, (_, i) => i) : [Number(timeSlot)];
  const dwList = dayOfWeek === null ? Array.from({ length: 7 }, (_, i) => i) : [Number(dayOfWeek)];

  for (const ts of tsList) {
    for (const dw of dwList) {
      const zone = await DemandZone.findOneAndUpdate(
        { zoneId: areaCode, timeSlot: ts, dayOfWeek: dw },
        {
          $set: {
            zoneId: areaCode,
            areaCode: areaCode,
            geohash: areaCode,
            timeSlot: ts,
            dayOfWeek: dw,
            surgeMultiplier: Number(multiplier),
            multiplier: Number(multiplier)
          }
        },
        { new: true, upsert: true }
      );
      updates.push(zone);
    }
  }

  return { updated: updates.length };
};

export const getAreaSurgeMultiplier = async (areaCode) => {
  if (!areaCode) {
    throw makeError("areaCode is required", 400);
  }

  const multiplier = await getCurrentSurgeMultiplier(areaCode, new Date());

  return {
    areaCode,
    multiplier
  };
};
