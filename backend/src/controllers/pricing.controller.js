import {
  estimateFare as estimateFareService,
  calculateFinalFare,
  setAreaSurgeMultiplier,
  getAreaSurgeMultiplier
} from "../services/pricing.service.js";
import { getSurgeForLocation } from "../services/analytics.service.js";

export const estimateFare = async (req, res, next) => {
  try {
    const { pickup, pickupCoords, drop, dropoff, dropCoords, rideType = "solo" } = req.body;
    const data = await estimateFareService(pickupCoords || pickup, dropCoords || drop || dropoff, rideType);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const finalizeFare = async (req, res, next) => {
  try {
    const data = await calculateFinalFare(req.params.rideId);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const setSurge = async (req, res, next) => {
  try {
    const data = await setAreaSurgeMultiplier(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getSurge = async (req, res, next) => {
  try {
    const data = await getAreaSurgeMultiplier(req.params.areaCode);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getSurgeByCoords = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      const err = new Error("lat and lng are required");
      err.statusCode = 400;
      throw err;
    }

    const data = await getSurgeForLocation(lat, lng);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};
