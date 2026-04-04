import Ride, { RIDE_STATUSES } from "../models/ride.model.js";
import User from "../models/user.model.js";
import Driver from "../models/driver.model.js";
import Earning from "../models/earning.model.js";
import LocationLog from "../models/locationLog.model.js";
import { calculateDistanceKm } from "../utils/distance.js";
import { estimateFare, calculateFinalFare } from "./pricing.service.js";
import MATCHING_CONFIG from "../config/matching.js";
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

  const existingEarning = await Earning.findOne({ ride: ride._id });
  if (existingEarning) {
    return;
  }

  const grossFare = Number(ride.finalFare || ride.estimatedFare || 0);
  const platformFee = Number((grossFare * 0.2).toFixed(2));
  const driverPayout = Number((grossFare - platformFee).toFixed(2));

  await Earning.create({
    driver: ride.driverId,
    ride: ride._id,
    grossFare,
    platformFee,
    driverPayout
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
