import Ride, { RIDE_STATUSES } from "../models/ride.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Driver from "../models/driver.model.js";
import Earning from "../models/earning.model.js";
import LocationLog from "../models/locationLog.model.js";
import { calculateDistanceKm } from "../utils/distance.js";
import { estimateFare, calculateFinalFare } from "./pricing.service.js";
import MATCHING_CONFIG from "../config/matching.js";
import PRICING_CONFIG from "../config/pricing.js";
import { incrementRequestAtLocation, recomputeActiveDriversAtLocation } from "./analytics.service.js";
import { emitToUser, emitToRole } from "../sockets/socketRegistry.js";

const activeMatchingTimeoutByRideId = new Map();

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const STATUS_TRANSITIONS = {
  requested: ["searching_driver"],
  searching_driver: ["driver_assigned", "no_driver_found"],
  driver_assigned: ["driver_arrived"],
  driver_arrived: ["trip_started"],
  trip_started: ["trip_completed"],
  trip_completed: [],
  no_driver_found: [],
  cancelled_by_passenger: [],
  cancelled_by_driver: []
};

const CANCELLATION_STATUSES = new Set(["cancelled_by_passenger", "cancelled_by_driver"]);

const emitRideFeed = (type, payload) => {
  emitToRole("admin", "admin:ride_feed", {
    type,
    timestamp: new Date().toISOString(),
    ...payload
  });
};

const normalizeStop = (stop, label, options = {}) => {
  const { requireAddress = false } = options;

  if (!stop) {
    throw makeError(`${label} is required`, 400);
  }

  const address = String(stop.address || "").trim();
  if (requireAddress && !address) {
    throw makeError(`${label}.address is required`, 400);
  }

  let coordinates = null;

  if (Array.isArray(stop.location?.coordinates) && stop.location.coordinates.length === 2) {
    coordinates = stop.location.coordinates;
  } else if (Array.isArray(stop.coordinates) && stop.coordinates.length === 2) {
    coordinates = stop.coordinates;
  } else if (Number.isFinite(stop.lat) && Number.isFinite(stop.lng)) {
    coordinates = [stop.lng, stop.lat];
  }

  if (!coordinates) {
    throw makeError(`${label}.location.coordinates must be a GeoJSON [longitude, latitude] pair`, 400);
  }

  return {
    address: address || `${label} point`,
    location: {
      type: "Point",
      coordinates: [Number(coordinates[0]), Number(coordinates[1])]
    }
  };
};

const stopToLatLng = (stop) => ({
  lat: stop.location.coordinates[1],
  lng: stop.location.coordinates[0]
});

const isSameObjectId = (left, right) => {
  if (!left || !right) {
    return false;
  }

  return String(left) === String(right);
};

const clearNoDriverTimeout = (rideId) => {
  const key = String(rideId);
  const timeoutRef = activeMatchingTimeoutByRideId.get(key);
  if (!timeoutRef) {
    return;
  }

  clearTimeout(timeoutRef);
  activeMatchingTimeoutByRideId.delete(key);
};

const getAllowedNextStatuses = (currentStatus) => {
  const standardTransitions = STATUS_TRANSITIONS[currentStatus] || [];
  return [...new Set([...standardTransitions, ...CANCELLATION_STATUSES])];
};

const validateRideStatusTransition = (currentStatus, nextStatus) => {
  if (!RIDE_STATUSES.includes(nextStatus)) {
    throw makeError(`Invalid ride status: ${nextStatus}`, 400);
  }

  if (currentStatus === nextStatus) {
    throw makeError(`Ride is already in status ${nextStatus}`, 400);
  }

  if (CANCELLATION_STATUSES.has(nextStatus)) {
    return;
  }

  const allowed = STATUS_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(nextStatus)) {
    const allowedStatuses = getAllowedNextStatuses(currentStatus).join(", ");
    throw makeError(
      `Invalid ride status transition from ${currentStatus} to ${nextStatus}. Allowed next statuses: ${allowedStatuses}`,
      400
    );
  }
};

const applyStatusTransition = async (ride, nextStatus) => {
  validateRideStatusTransition(ride.status, nextStatus);

  ride.status = nextStatus;
  if (!Array.isArray(ride.statusHistory)) {
    ride.statusHistory = [];
  }

  ride.statusHistory.push({ status: nextStatus, timestamp: new Date() });
  await ride.save();

  if (nextStatus !== "searching_driver") {
    clearNoDriverTimeout(ride._id);
  }

  return ride;
};

const createRideEarningIfMissing = async (ride) => {
  if (!ride.driverId) {
    return;
  }

  const existingEarning = await Earning.findOne({ rideId: ride._id });
  if (existingEarning) {
    return;
  }

  const grossAmount = Number(ride.finalFare || ride.estimatedFare || 0);
  const commissionRate = Number(PRICING_CONFIG.commissionRatePercent || 20);
  const commissionAmount = Number(((grossAmount * commissionRate) / 100).toFixed(2));
  const netAmount = Number((grossAmount - commissionAmount).toFixed(2));

  await Earning.create({
    driverId: ride.driverId,
    rideId: ride._id,
    grossAmount,
    commissionRate,
    commissionAmount,
    netAmount,
    payoutStatus: "pending",
    legacy: {
      grossFare: grossAmount,
      platformFee: commissionAmount,
      driverPayout: netAmount
    }
  });
};

const scheduleNoDriverTimeout = (rideId) => {
  const key = String(rideId);
  if (activeMatchingTimeoutByRideId.has(key)) {
    return;
  }

  const timeoutRef = setTimeout(async () => {
    activeMatchingTimeoutByRideId.delete(key);

    try {
      const ride = await Ride.findById(rideId);
      if (!ride || ride.driverId || ride.status !== "searching_driver") {
        return;
      }

      await applyStatusTransition(ride, "no_driver_found");
      emitToUser(String(ride.passengerId), "passenger:ride_status", {
        rideId: String(ride._id),
        status: "no_driver_found"
      });
      emitRideFeed("no_driver_found", { rideId: String(ride._id) });
    } catch (error) {
      console.error("No-driver timeout flow failed:", error.message);
    }
  }, MATCHING_CONFIG.noDriverTimeoutSec * 1000);

  activeMatchingTimeoutByRideId.set(key, timeoutRef);
};

const findNearbyDrivers = async (pickupLocation, excludedDriverUserIds = []) => {
  const excluded = excludedDriverUserIds.map((id) => String(id));

  return Driver.find({
    availabilityStatus: true,
    verificationStatus: "approved",
    ...(excluded.length > 0 ? { userId: { $nin: excluded } } : {}),
    currentLocation: {
      $nearSphere: {
        $geometry: pickupLocation,
        $maxDistance: MATCHING_CONFIG.searchRadiusKm * 1000
      }
    }
  })
    .limit(MATCHING_CONFIG.maxCandidates)
    .populate("userId", "name email phone");
};

const requestNearestDriver = async (ride) => {
  if (ride.status !== "searching_driver") {
    return null;
  }

  const excludedDriverUserIds = (ride.rejectedDriverIds || []).map((id) => String(id));
  if (ride.offeredDriverId) {
    excludedDriverUserIds.push(String(ride.offeredDriverId));
  }

  const nearbyDrivers = await findNearbyDrivers(ride.pickup.location, excludedDriverUserIds);

  for (const driver of nearbyDrivers) {
    const driverUserId = String(driver.userId?._id || driver.userId);

    const delivered = emitToUser(driverUserId, "driver:new_ride_request", {
      rideId: String(ride._id),
      pickup: ride.pickup,
      drop: ride.drop,
      rideType: ride.rideType,
      estimatedFare: ride.estimatedFare,
      passengerId: String(ride.passengerId)
    });

    if (!delivered) {
      continue;
    }

    ride.offeredDriverId = driverUserId;
    await ride.save();

    emitRideFeed("driver_request_sent", {
      rideId: String(ride._id),
      driverUserId
    });

    return ride;
  }

  return null;
};

const triggerDriverSearch = async (rideId) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw makeError("Ride not found", 404);
  }

  if (ride.status === "requested") {
    await applyStatusTransition(ride, "searching_driver");
  }

  if (ride.status !== "searching_driver" || ride.driverId) {
    return ride;
  }

  scheduleNoDriverTimeout(ride._id);
  await requestNearestDriver(ride);
  return ride;
};

const resolveEventCoordinates = (ride, payload, mode) => {
  if (Number.isFinite(Number(payload?.latitude)) && Number.isFinite(Number(payload?.longitude))) {
    return {
      latitude: Number(payload.latitude),
      longitude: Number(payload.longitude)
    };
  }

  if (mode === "trip_ended") {
    return {
      latitude: ride.drop.location.coordinates[1],
      longitude: ride.drop.location.coordinates[0]
    };
  }

  return {
    latitude: ride.pickup.location.coordinates[1],
    longitude: ride.pickup.location.coordinates[0]
  };
};

const createRideEventLog = async (ride, eventType, payload = {}) => {
  const { latitude, longitude } = resolveEventCoordinates(ride, payload, eventType);

  await LocationLog.create({
    rideId: ride._id,
    eventType,
    source: "driver",
    location: {
      type: "Point",
      coordinates: [longitude, latitude]
    },
    speed: Number.isFinite(Number(payload.speed)) ? Number(payload.speed) : null,
    heading: Number.isFinite(Number(payload.heading)) ? Number(payload.heading) : null,
    timestamp: new Date()
  });
};

export const transitionRideStatus = async (rideId, nextStatus) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw makeError("Ride not found", 404);
  }

  return applyStatusTransition(ride, nextStatus);
};

export const estimateRideBookingFare = async (payload) => {
  const { pickup, drop, dropoff, rideType = "solo" } = payload;
  const normalizedPickup = normalizeStop(pickup, "pickup");
  const normalizedDrop = normalizeStop(drop || dropoff, "drop");

  return estimateFare(stopToLatLng(normalizedPickup), stopToLatLng(normalizedDrop), rideType);
};

export const bookRide = async (payload) => {
  const {
    passengerId,
    rideType = "solo",
    pickup,
    drop,
    dropoff,
    sharedRideGroupId = null,
    seatsBooked = 1,
    estimatedDurationMin
  } = payload;

  const passenger = await User.findOne({ _id: passengerId, role: "passenger", status: "active" });
  if (!passenger) {
    throw makeError("Passenger not found or inactive", 404);
  }

  const normalizedPickup = normalizeStop(pickup, "pickup");
  const normalizedDrop = normalizeStop(drop || dropoff, "drop");

  const pricingEstimate = await estimateFare(stopToLatLng(normalizedPickup), stopToLatLng(normalizedDrop), rideType);
  const midpointEstimatedFare = Number(((pricingEstimate.estimate.min + pricingEstimate.estimate.max) / 2).toFixed(2));
  const distanceKm = calculateDistanceKm(stopToLatLng(normalizedPickup), stopToLatLng(normalizedDrop));
  const estimatedDuration =
    estimatedDurationMin !== undefined
      ? Number(estimatedDurationMin)
      : Number(((pricingEstimate.durationMin.min + pricingEstimate.durationMin.max) / 2).toFixed(2));

  // Shared ride flow: attempt to join an existing compatible shared ride
  if (rideType === "shared") {
    // find candidate shared rides that haven't started and have seats
    const candidates = await Ride.find({
      rideType: "shared",
      status: { $in: ["requested", "searching_driver", "driver_assigned"] },
      // ensure group has room
      seatsBooked: { $lt: MATCHING_CONFIG.maxSharedGroupSeats }
    }).sort({ createdAt: -1 });

    for (const candidate of candidates) {
      try {
        const pickupDistance = calculateDistanceKm(stopToLatLng(normalizedPickup), stopToLatLng(candidate.pickup));
        const dropDistance = calculateDistanceKm(stopToLatLng(normalizedDrop), stopToLatLng(candidate.drop));

        if (
          pickupDistance <= MATCHING_CONFIG.sharedPickupMaxKm &&
          dropDistance <= MATCHING_CONFIG.sharedDropMaxKm &&
          candidate.seatsBooked < MATCHING_CONFIG.maxSharedGroupSeats
        ) {
          // join this candidate
          const existingPassengers = Array.isArray(candidate.passengers) ? candidate.passengers : [];
          const newTotal = existingPassengers.length + 1;

          // compute new per-passenger share and service fee
          const perPassenger = Number((midpointEstimatedFare / newTotal).toFixed(2));
          const serviceFee = Number(((PRICING_CONFIG.sharedServiceFeePercent || 5) / 100 * perPassenger).toFixed(2));
          const newFareShare = Number((perPassenger + serviceFee).toFixed(2));

          // add new passenger
          existingPassengers.push({
            passengerId,
            pickupCoords: { lat: stopToLatLng(normalizedPickup).lat, lng: stopToLatLng(normalizedPickup).lng },
            dropCoords: { lat: stopToLatLng(normalizedDrop).lat, lng: stopToLatLng(normalizedDrop).lng },
            fareShare: newFareShare,
            status: "booked"
          });

          // recompute fareShare for all passengers evenly
          const recomputedPerPassenger = Number((midpointEstimatedFare / newTotal).toFixed(2));
          const recomputedServiceFee = Number(((PRICING_CONFIG.sharedServiceFeePercent || 5) / 100 * recomputedPerPassenger).toFixed(2));
          for (let i = 0; i < existingPassengers.length; i++) {
            existingPassengers[i].fareShare = Number((recomputedPerPassenger + recomputedServiceFee).toFixed(2));
          }

          candidate.passengers = existingPassengers;
          candidate.seatsBooked = (candidate.seatsBooked || 0) + 1;
          candidate.estimatedFare = midpointEstimatedFare; // total fare for trip
          await candidate.save();

          emitRideFeed("shared_ride_joined", { rideId: String(candidate._id), passengerId: String(passengerId) });

          return Ride.findById(candidate._id).populate("driverId", "name email phone");
        }
      } catch (e) {
        // ignore candidate errors and continue
        console.error("shared-ride candidate check failed:", e.message);
        continue;
      }
    }

    // no compatible ride found — create new shared ride group
    const sharedGroupId = String(mongoose.Types.ObjectId());
    const serviceFeeInit = Number(((PRICING_CONFIG.sharedServiceFeePercent || 5) / 100 * midpointEstimatedFare).toFixed(2));
    const fareShareInit = Number((midpointEstimatedFare + serviceFeeInit).toFixed(2));

    const newRide = await Ride.create({
      passengerId,
      rideType,
      pickup: normalizedPickup,
      drop: normalizedDrop,
      sharedRideGroupId: sharedGroupId,
      seatsBooked: 1,
      passengers: [
        {
          passengerId,
          pickupCoords: { lat: stopToLatLng(normalizedPickup).lat, lng: stopToLatLng(normalizedPickup).lng },
          dropCoords: { lat: stopToLatLng(normalizedDrop).lat, lng: stopToLatLng(normalizedDrop).lng },
          fareShare: fareShareInit,
          status: "booked"
        }
      ],
      distanceKm,
      estimatedDurationMin: estimatedDuration,
      estimatedFare: midpointEstimatedFare,
      finalFare: null,
      surgeMultiplier: pricingEstimate.surgeMultiplier,
      status: "requested",
      statusHistory: [{ status: "requested", timestamp: new Date() }]
    });

    emitRideFeed("shared_ride_booked", { rideId: String(newRide._id), passengerId: String(passengerId) });
    await triggerDriverSearch(newRide._id);
    return Ride.findById(newRide._id).populate("driverId", "name email phone");
  }

  // Solo/default flow
  const ride = await Ride.create({
    passengerId,
    rideType,
    pickup: normalizedPickup,
    drop: normalizedDrop,
    sharedRideGroupId,
    seatsBooked,
    distanceKm,
    estimatedDurationMin: estimatedDuration,
    estimatedFare: midpointEstimatedFare,
    finalFare: null,
    surgeMultiplier: pricingEstimate.surgeMultiplier,
    status: "requested",
    statusHistory: [{ status: "requested", timestamp: new Date() }]
  });

  emitRideFeed("ride_booked", {
    rideId: String(ride._id),
    passengerId: String(ride.passengerId)
  });

  await triggerDriverSearch(ride._id);
  return Ride.findById(ride._id).populate("driverId", "name email phone");
};

export const getSharedRideGroup = async (groupId) => {
  if (!groupId) {
    const err = new Error("groupId is required");
    err.statusCode = 400;
    throw err;
  }

  const ride = await Ride.findOne({ sharedRideGroupId: groupId }).populate("passengers.passengerId", "name email phone").lean();
  if (!ride) {
    const err = new Error("Shared ride group not found");
    err.statusCode = 404;
    throw err;
  }

  return {
    groupId,
    rideId: ride._id,
    seatsBooked: ride.seatsBooked,
    passengers: ride.passengers,
    pickup: ride.pickup,
    drop: ride.drop,
    status: ride.status
  };
};

export const respondToRideRequestByDriver = async ({ rideId, driverUserId, response }) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw makeError("Ride not found", 404);
  }

  if (ride.status !== "searching_driver") {
    throw makeError("Ride is not in driver search state", 400);
  }

  if (!ride.offeredDriverId || !isSameObjectId(ride.offeredDriverId, driverUserId)) {
    throw makeError("No pending ride request for this driver", 403);
  }

  const normalizedResponse = String(response || "").toLowerCase();
  if (!["accepted", "rejected"].includes(normalizedResponse)) {
    throw makeError("response must be accepted or rejected", 400);
  }

  if (normalizedResponse === "accepted") {
    ride.driverId = driverUserId;
    ride.offeredDriverId = null;
    await applyStatusTransition(ride, "driver_assigned");

    await Driver.findOneAndUpdate({ userId: driverUserId }, { $set: { availabilityStatus: false } });

    const driverProfile = await Driver.findOne({ userId: driverUserId })
      .populate("userId", "name email phone")
      .lean();

    emitToUser(String(ride.passengerId), "passenger:driver_assigned", {
      rideId: String(ride._id),
      driver: driverProfile
        ? {
            id: String(driverProfile.userId?._id || driverUserId),
            name: driverProfile.userId?.name,
            phone: driverProfile.userId?.phone,
            vehicleInfo: driverProfile.vehicleInfo,
            averageRating: driverProfile.averageRating
          }
        : { id: String(driverUserId) }
    });

    emitToUser(String(ride.passengerId), "passenger:ride_status", {
      rideId: String(ride._id),
      status: "driver_assigned"
    });

    emitRideFeed("driver_assigned", {
      rideId: String(ride._id),
      driverUserId: String(driverUserId)
    });

    return Ride.findById(ride._id).populate("driverId", "name email phone");
  }

  const rejectedIds = new Set((ride.rejectedDriverIds || []).map((id) => String(id)));
  rejectedIds.add(String(driverUserId));
  ride.rejectedDriverIds = [...rejectedIds];
  ride.offeredDriverId = null;
  await ride.save();

  emitRideFeed("driver_rejected", {
    rideId: String(ride._id),
    driverUserId: String(driverUserId)
  });

  await requestNearestDriver(ride);
  return Ride.findById(ride._id).populate("driverId", "name email phone");
};

export const updateRideStatusByDriver = async ({ rideId, driverUserId, status, latitude, longitude, speed, heading }) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw makeError("Ride not found", 404);
  }

  if (!ride.driverId || !isSameObjectId(ride.driverId, driverUserId)) {
    throw makeError("Only the assigned driver can update this ride", 403);
  }

  const statusMap = {
    arrived: "driver_arrived",
    started: "trip_started",
    completed: "trip_completed"
  };

  const normalizedStatus = statusMap[String(status || "").toLowerCase()] || status;

  const eventTypeByStatus = {
    driver_arrived: "arrived_pickup",
    trip_started: "trip_started",
    trip_completed: "trip_ended"
  };

  await transitionRideStatus(rideId, normalizedStatus);

  if (eventTypeByStatus[normalizedStatus]) {
    const refreshedRide = await Ride.findById(rideId);
    await createRideEventLog(refreshedRide, eventTypeByStatus[normalizedStatus], {
      latitude,
      longitude,
      speed,
      heading
    });
  }

  if (normalizedStatus === "trip_completed") {
    await calculateFinalFare(rideId);
    const pricedRide = await Ride.findById(rideId);
    await createRideEarningIfMissing(pricedRide);
    await Driver.findOneAndUpdate({ userId: driverUserId }, { $set: { availabilityStatus: true } });
  }

  if (normalizedStatus === "trip_completed" || normalizedStatus === "driver_assigned" || normalizedStatus === "searching_driver") {
    // update demand metrics for pickup location on booking/completion
    try {
      const coords = ride.pickup.location.coordinates;
      await incrementRequestAtLocation(coords[1], coords[0], new Date());
    } catch (e) {
      // don't fail ride flow on analytics errors
      console.error("analytics.incrementRequestAtLocation failed", e.message);
    }
  }

  emitToUser(String(ride.passengerId), "passenger:ride_status", {
    rideId: String(ride._id),
    status: normalizedStatus
  });

  emitRideFeed("ride_status", {
    rideId: String(ride._id),
    status: normalizedStatus,
    driverUserId: String(driverUserId)
  });

  return Ride.findById(rideId).populate("driverId", "name email phone");
};

export const cancelRideByActor = async ({ rideId, actorRole, actorUserId }) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw makeError("Ride not found", 404);
  }

  if (actorRole === "passenger" && !isSameObjectId(ride.passengerId, actorUserId)) {
    throw makeError("Passenger can only cancel their own ride", 403);
  }

  if (actorRole === "driver" && !isSameObjectId(ride.driverId, actorUserId)) {
    throw makeError("Driver can only cancel assigned rides", 403);
  }

  const cancelledBy = actorRole === "driver" ? "driver" : "passenger";
  const nextStatus = cancelledBy === "driver" ? "cancelled_by_driver" : "cancelled_by_passenger";

  await applyStatusTransition(ride, nextStatus);
  ride.cancelledBy = cancelledBy;
  ride.cancelledAt = new Date();
  await ride.save();

  if (ride.driverId) {
    await Driver.findOneAndUpdate({ userId: ride.driverId }, { $set: { availabilityStatus: true } });
  }

  emitToUser(String(ride.passengerId), "passenger:ride_status", {
    rideId: String(ride._id),
    status: nextStatus,
    cancelledBy
  });

  emitRideFeed("ride_cancelled", {
    rideId: String(ride._id),
    cancelledBy,
    actorUserId: String(actorUserId)
  });

  return Ride.findById(rideId).populate("driverId", "name email phone");
};

export const handleDriverLocationUpdate = async ({ driverUserId, rideId, latitude, longitude, speed, heading }) => {
  if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) {
    throw makeError("latitude and longitude are required", 400);
  }

  const ride = rideId
    ? await Ride.findById(rideId)
    : await Ride.findOne({
        driverId: driverUserId,
        status: { $in: ["driver_assigned", "driver_arrived", "trip_started"] }
      }).sort({ updatedAt: -1 });

  if (!ride) {
    throw makeError("No active ride found for location update", 404);
  }

  if (!isSameObjectId(ride.driverId, driverUserId)) {
    throw makeError("Driver is not assigned to this ride", 403);
  }

  const log = await LocationLog.create({
    rideId: ride._id,
    eventType: "location_ping",
    source: "driver",
    location: {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)]
    },
    speed: Number.isFinite(Number(speed)) ? Number(speed) : null,
    heading: Number.isFinite(Number(heading)) ? Number(heading) : null,
    timestamp: new Date()
  });

  emitToUser(String(ride.passengerId), "passenger:driver_location", {
    rideId: String(ride._id),
    driverId: String(driverUserId),
    latitude: Number(latitude),
    longitude: Number(longitude),
    speed: Number.isFinite(Number(speed)) ? Number(speed) : null,
    heading: Number.isFinite(Number(heading)) ? Number(heading) : null,
    timestamp: log.timestamp
  });

  emitRideFeed("driver_location", {
    rideId: String(ride._id),
    driverUserId: String(driverUserId)
  });

  // recompute activeDrivers for the driver's current zone
  try {
    await recomputeActiveDriversAtLocation(Number(latitude), Number(longitude));
  } catch (e) {
    console.error("analytics.recomputeActiveDriversAtLocation failed", e.message);
  }

  return log;
};

export const setDriverAvailabilityStatus = async ({ driverUserId, availabilityStatus }) => {
  const requestedAvailability = Boolean(availabilityStatus);
  const currentDriver = await Driver.findOne({ userId: driverUserId });

  if (!currentDriver) {
    throw makeError("Driver profile not found", 404);
  }

  if (requestedAvailability && currentDriver.verificationStatus !== "approved") {
    throw makeError("Driver must be approved before going online", 403);
  }

  const driver = await Driver.findOneAndUpdate(
    { userId: driverUserId },
    { $set: { availabilityStatus: requestedAvailability } },
    { new: true }
  );

  emitRideFeed("driver_availability", {
    driverUserId: String(driverUserId),
    availabilityStatus: driver.availabilityStatus
  });

  return driver;
};

export const getRideById = async (rideId) => {
  const ride = await Ride.findById(rideId)
    .populate("passengerId", "name email phone")
    .populate("driverId", "name email phone")
    .lean();

  if (!ride) {
    throw makeError("Ride not found", 404);
  }

  if (ride.driverId?._id) {
    const driverProfile = await Driver.findOne({ userId: ride.driverId._id })
      .select("vehicleInfo verificationStatus availabilityStatus averageRating totalTrips")
      .lean();

    if (driverProfile) {
      ride.driverProfile = driverProfile;
    }
  }

  return ride;
};

export const listRides = async ({ status }) => {
  const query = status ? { status } : {};

  return Ride.find(query)
    .populate("passengerId", "name phone")
    .populate("driverId", "name phone")
    .sort({ createdAt: -1 });
};

// Backward-compatible aliases.
export const requestRide = bookRide;
export const cancelRide = async (rideId, options = {}) => {
  return cancelRideByActor({
    rideId,
    actorRole: options.cancelledBy || "passenger",
    actorUserId: options.actorUserId
  });
};
