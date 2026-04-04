import {
  estimateRideBookingFare,
  bookRide,
  getRideById,
  updateRideStatusByDriver,
  cancelRideByActor
} from "../services/rides.service.js";

export const estimateRide = async (req, res, next) => {
  try {
    const data = await estimateRideBookingFare(req.body);
    return res.status(200).json({ success: true, data });
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

    const data = await bookRide(payload);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getRide = async (req, res, next) => {
  try {
    const data = await getRideById(req.params.rideId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const updateRideStatus = async (req, res, next) => {
  try {
    const data = await updateRideStatusByDriver({
      rideId: req.params.rideId,
      driverUserId: req.user.userId,
      status: req.body.status
    });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const cancelRideById = async (req, res, next) => {
  try {
    const data = await cancelRideByActor({
      rideId: req.params.rideId,
      actorRole: req.user.role,
      actorUserId: req.user.userId
    });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};
