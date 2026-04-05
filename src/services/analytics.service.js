import Ride from "../models/ride.model.js";
import Driver from "../models/driver.model.js";
import DemandZone from "../models/demandZone.model.js";
import Earning from "../models/earning.model.js";
import { encodeGeohash } from "../utils/geohash.js";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const computeDemandScore = ({ requestCount = 0, completedRides = 0, cancellations = 0 }) => {
  // simple heuristic: requests weigh most, cancellations reduce score, completions add moderate weight
  return requestCount + 0.5 * completedRides - 1.0 * cancellations;
};

const computeSurge = ({ requestCount = 0, activeDrivers = 0 }) => {
  const ratio = requestCount / Math.max(activeDrivers, 1);
  const multiplier = 1 + ((ratio - 1) * 0.3);
  return Number(clamp(multiplier, 1.0, 2.5).toFixed(2));
};

export const aggregateDemandZones = async ({ from, to, precision = 6 } = {}) => {
  const fromDate = from ? new Date(from) : new Date(Date.now() - 1000 * 60 * 60 * 3); // default last 3 hours
  const toDate = to ? new Date(to) : new Date();

  // fetch rides in window
  const rides = await Ride.find({ createdAt: { $gte: fromDate, $lte: toDate } }).select(
    "pickup.status pickup.location status createdAt"
  );

  const buckets = new Map();

  for (const r of rides) {
    const lat = r.pickup.location.coordinates[1];
    const lng = r.pickup.location.coordinates[0];
    const zone = encodeGeohash(lat, lng, precision);
    const dt = r.createdAt || new Date();
    const timeSlot = dt.getHours();
    const dayOfWeek = dt.getDay();
    const key = `${zone}:${timeSlot}:${dayOfWeek}`;

    if (!buckets.has(key)) {
      buckets.set(key, { zone, timeSlot, dayOfWeek, requestCount: 0, completedRides: 0, cancellations: 0 });
    }

    const bucket = buckets.get(key);
    bucket.requestCount += 1;
    if (r.status === "trip_completed") bucket.completedRides += 1;
    if (r.status === "cancelled_by_passenger" || r.status === "cancelled_by_driver") bucket.cancellations += 1;
  }

  // compute activeDrivers per zone by counting drivers in each zone
  const zoneKeys = Array.from(new Set(Array.from(buckets.values()).map((b) => b.zone)));
  const driverCounts = {};

  if (zoneKeys.length > 0) {
    const drivers = await Driver.find({ availabilityStatus: true, currentLocation: { $exists: true } }).select(
      "currentLocation.userId currentLocation"
    );

    for (const d of drivers) {
      if (!d.currentLocation || !d.currentLocation.coordinates) continue;
      const lat = d.currentLocation.coordinates[1];
      const lng = d.currentLocation.coordinates[0];
      const dz = encodeGeohash(lat, lng, precision);
      if (!driverCounts[dz]) driverCounts[dz] = 0;
      driverCounts[dz] += 1;
    }
  }

  const results = [];

  for (const bucket of buckets.values()) {
    const activeDrivers = driverCounts[bucket.zone] || 0;
    const demandScore = computeDemandScore(bucket);
    const surgeMultiplier = computeSurge({ requestCount: bucket.requestCount, activeDrivers });

    const upsert = await DemandZone.findOneAndUpdate(
      { zoneId: bucket.zone, timeSlot: bucket.timeSlot, dayOfWeek: bucket.dayOfWeek },
      {
        $set: {
          zoneId: bucket.zone,
          areaCode: bucket.zone,
          geohash: bucket.zone,
          timeSlot: bucket.timeSlot,
          dayOfWeek: bucket.dayOfWeek,
          requestCount: bucket.requestCount,
          completedRides: bucket.completedRides,
          cancellations: bucket.cancellations,
          activeDrivers,
          demandScore,
          surgeMultiplier,
          multiplier: surgeMultiplier
        }
      },
      { upsert: true, new: true }
    );

    results.push(upsert);
  }

  return results;
};

export const getHeatmapForCurrentHour = async () => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  const records = await DemandZone.find({ timeSlot: hour, dayOfWeek: day }).lean();
  return records;
};

export const getSurgeForLocation = async (lat, lng, precision = 6) => {
  const zone = encodeGeohash(Number(lat), Number(lng), precision);
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  const record = await DemandZone.findOne({ zoneId: zone, timeSlot: hour, dayOfWeek: day }).lean();
  if (!record) return { surgeMultiplier: 1 };
  return { surgeMultiplier: record.surgeMultiplier || record.multiplier || 1 };
};

export const getZoneHistory = async (zoneId, from, to) => {
  const query = { zoneId };
  if (from || to) query.createdAt = {};
  if (from) query.createdAt.$gte = new Date(from);
  if (to) query.createdAt.$lte = new Date(to);

  return DemandZone.find(query).sort({ createdAt: 1 }).lean();
};

export const exportDataset = async ({ from, to } = {}) => {
  const query = {};
  if (from || to) query.createdAt = {};
  if (from) query.createdAt.$gte = new Date(from);
  if (to) query.createdAt.$lte = new Date(to);

  const records = await DemandZone.find(query).lean();
  // Return as JSON-array ready for CSV conversion client-side
  return records.map((r) => ({
    zone: r.zoneId,
    hour: r.timeSlot,
    dayOfWeek: r.dayOfWeek,
    requestCount: r.requestCount,
    activeDrivers: r.activeDrivers,
    completedRides: r.completedRides,
    cancellations: r.cancellations,
    demandScore: r.demandScore,
    surgeMultiplier: r.surgeMultiplier
  }));
};

export const incrementRequestAtLocation = async (lat, lng, when = new Date(), precision = 6) => {
  const zone = encodeGeohash(Number(lat), Number(lng), precision);
  const hour = when.getHours();
  const day = when.getDay();

  const updated = await DemandZone.findOneAndUpdate(
    { zoneId: zone, timeSlot: hour, dayOfWeek: day },
    { $inc: { requestCount: 1 }, $set: { zoneId: zone, areaCode: zone, geohash: zone } },
    { upsert: true, new: true }
  );

  // recompute metrics lightly
  const activeDrivers = await Driver.countDocuments({ availabilityStatus: true, currentLocation: { $exists: true } });
  const demandScore = computeDemandScore({ requestCount: updated.requestCount, completedRides: updated.completedRides, cancellations: updated.cancellations });
  const surgeMultiplier = computeSurge({ requestCount: updated.requestCount, activeDrivers });

  updated.activeDrivers = activeDrivers;
  updated.demandScore = demandScore;
  updated.surgeMultiplier = surgeMultiplier;
  updated.multiplier = surgeMultiplier;
  await updated.save();

  return updated;
};

export const recomputeActiveDriversAtLocation = async (lat, lng, precision = 6) => {
  const zone = encodeGeohash(Number(lat), Number(lng), precision);
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  const drivers = await Driver.find({ availabilityStatus: true, currentLocation: { $exists: true } }).select("currentLocation");
  let count = 0;
  for (const d of drivers) {
    if (!d.currentLocation?.coordinates) continue;
    const lat2 = d.currentLocation.coordinates[1];
    const lng2 = d.currentLocation.coordinates[0];
    const dz = encodeGeohash(lat2, lng2, precision);
    if (dz === zone) count += 1;
  }

  const doc = await DemandZone.findOneAndUpdate(
    { zoneId: zone, timeSlot: hour, dayOfWeek: day },
    { $set: { activeDrivers: count } },
    { upsert: true, new: true }
  );

  // recompute surge & score
  doc.demandScore = computeDemandScore({ requestCount: doc.requestCount, completedRides: doc.completedRides, cancellations: doc.cancellations });
  doc.surgeMultiplier = computeSurge({ requestCount: doc.requestCount, activeDrivers: doc.activeDrivers });
  doc.multiplier = doc.surgeMultiplier;
  await doc.save();

  return doc;
};

export default {
  aggregateDemandZones,
  getHeatmapForCurrentHour,
  getSurgeForLocation,
  getZoneHistory,
  exportDataset
};

export const getRideAnalytics = async ({ startDate, endDate }) => {
  const dateMatch = {};
  if (startDate) {
    dateMatch.$gte = new Date(startDate);
  }
  if (endDate) {
    dateMatch.$lte = new Date(endDate);
  }

  const matchStage = Object.keys(dateMatch).length > 0 ? { createdAt: dateMatch } : {};

  const byStatus = await Ride.aggregate([
    { $match: matchStage },
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  return { byStatus };
};

export const getRevenueAnalytics = async ({ startDate, endDate }) => {
  const dateMatch = {};
  if (startDate) {
    dateMatch.$gte = new Date(startDate);
  }
  if (endDate) {
    dateMatch.$lte = new Date(endDate);
  }

  const matchStage = Object.keys(dateMatch).length > 0 ? { createdAt: dateMatch } : {};

  const totals = await Earning.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        grossAmount: { $sum: "$grossAmount" },
        commissionAmount: { $sum: "$commissionAmount" },
        netAmount: { $sum: "$netAmount" }
      }
    }
  ]);

  return totals[0] || { grossAmount: 0, commissionAmount: 0, netAmount: 0 };
};
