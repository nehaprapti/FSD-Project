import {
  getRideAnalytics,
  getRevenueAnalytics
} from "../services/analytics.service.js";
import {
  aggregateDemandZones,
  getHeatmapForCurrentHour,
  getZoneHistory,
  exportDataset
} from "../services/analytics.service.js";

export const getRideStats = async (req, res, next) => {
  try {
    const data = await getRideAnalytics(req.query);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getRevenueStats = async (req, res, next) => {
  try {
    const data = await getRevenueAnalytics(req.query);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const aggregateZones = async (req, res, next) => {
  try {
    const data = await aggregateDemandZones(req.query);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getHeatmap = async (req, res, next) => {
  try {
    const data = await getHeatmapForCurrentHour();
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const { zone, from, to } = req.query;
    if (!zone) {
      const err = new Error("zone is required");
      err.statusCode = 400;
      throw err;
    }
    const data = await getZoneHistory(zone, from, to);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const exportAnalytics = async (req, res, next) => {
  try {
    const data = await exportDataset(req.query);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};
