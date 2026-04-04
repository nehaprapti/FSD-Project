import { listPassengers, getPassengerProfile, getPassengerRideHistory } from "../services/passengers.service.js";

export const getPassengers = async (req, res, next) => {
  try {
    const data = await listPassengers();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getPassenger = async (req, res, next) => {
  try {
    const data = await getPassengerProfile(req.params.passengerId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getMyRideHistory = async (req, res, next) => {
  try {
    const data = await getPassengerRideHistory(req.user.userId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};
