import {
  getDriverEarningsSummary,
  getDriverTrips,
  adminListPendingPayouts,
  markEarningPaid
} from "../services/earnings.service.js";

export const getEarningsSummary = async (req, res, next) => {
  try {
    const period = String(req.query.period || "month").toLowerCase();
    const data = await getDriverEarningsSummary(req.user.userId, period);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getEarningsTrips = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const data = await getDriverTrips(req.user.userId, { page, limit });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const adminGetPendingPayouts = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 50;
    const data = await adminListPendingPayouts({ page, limit });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const adminMarkPaid = async (req, res, next) => {
  try {
    const { earningsId } = req.params;
    const record = await markEarningPaid(earningsId, { paidAt: new Date() });
    return res.status(200).json({ success: true, data: record });
  } catch (error) {
    return next(error);
  }
};
