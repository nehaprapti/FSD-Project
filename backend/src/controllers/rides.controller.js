import {
  estimateRideBookingFare,
  bookRide,
  getSharedRideGroup,
  getRideById,
  updateRideStatusByDriver,
  cancelRideByActor
} from "../services/rides.service.js";

export const estimateRide = async (req, res, next) => {
  try {
    const calculation = await estimateRideBookingFare(req.body);

    const fareBreakdown = {
      ...calculation.breakdown.max,
      total: calculation.estimate.max,
      surgeMultiplier: calculation.surgeMultiplier,
      distanceKm: calculation.distanceKm.max
    };

    return res.status(200).json({
      success: true,
      fareBreakdown,
      ...calculation
    });
  } catch (error) {
    return next(error);
  }
};

export const bookRideController = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      passengerId: req.user.userId
    };

    const ride = await bookRide(payload);
    const rideData = ride.toObject ? ride.toObject() : ride;

    // Test 39: Return 200/202 if no driver found immediately
    const statusCode = ["no_driver_found"].includes(rideData.status) ? 202 : 201;

    return res.status(statusCode).json({
      success: true,
      rideId: rideData._id,
      driver: rideData.driverId,
      passenger: rideData.passengerId,
      fare: rideData.estimatedFare,
      ...rideData
    });
  } catch (error) {
    return next(error);
  }
};

export const getRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;
    if (rideId === "undefined" || !rideId) {
      return res.status(400).json({ success: false, message: "Invalid ride ID" });
    }

    const ride = await getRideById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }

    const rideData = ride.toObject ? ride.toObject() : ride;

    return res.status(200).json({
      success: true,
      driver: rideData.driverId,
      passenger: rideData.passengerId,
      fare: rideData.estimatedFare || rideData.finalFare,
      ...rideData
    });
  } catch (error) {
    // CastError check
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }
    return next(error);
  }
};

export const updateRideStatus = async (req, res, next) => {
  try {
    const ride = await updateRideStatusByDriver({
      rideId: req.params.rideId,
      driverUserId: req.user.userId,
      status: req.body.status
    });
    const rideData = ride.toObject ? ride.toObject() : ride;

    return res.status(200).json({
      success: true,
      driver: rideData.driverId,
      passenger: rideData.passengerId,
      fare: rideData.estimatedFare || rideData.finalFare,
      ...rideData
    });
  } catch (error) {
    return next(error);
  }
};

export const cancelRideById = async (req, res, next) => {
  try {
    const ride = await cancelRideByActor({
      rideId: req.params.rideId,
      actorRole: req.user.role,
      actorUserId: req.user.userId
    });
    const rideData = ride.toObject ? ride.toObject() : ride;

    return res.status(200).json({
      success: true,
      driver: rideData.driverId,
      passenger: rideData.passengerId,
      fare: rideData.estimatedFare || rideData.finalFare,
      ...rideData
    });
  } catch (error) {
    return next(error);
  }
};

export const getSharedGroup = async (req, res, next) => {
  try {
    const data = await getSharedRideGroup(req.params.groupId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};
