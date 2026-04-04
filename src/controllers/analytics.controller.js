import { getRideAnalytics, getRevenueAnalytics } from "../services/analytics.service.js";

export const getRideStats = async (req, res, next) => {
  try {
    const data = await getRideAnalytics(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getRevenueStats = async (req, res, next) => {
  try {
    const data = await getRevenueAnalytics(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};
