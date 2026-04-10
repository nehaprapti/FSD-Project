import { listDrivers, getDriverProfile, updateDriverAvailability, updateDriverProfile } from "../services/drivers.service.js";

export const getDrivers = async (req, res, next) => {
  try {
    const data = await listDrivers(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getDriver = async (req, res, next) => {
  try {
    const data = await getDriverProfile(req.params.driverId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const setDriverAvailability = async (req, res, next) => {
  try {
    const data = await updateDriverAvailability(req.user.userId, req.body.isOnline);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const data = await getDriverProfile(req.user.userId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const data = await updateDriverProfile(req.user.userId, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};
