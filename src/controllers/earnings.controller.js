import { getDriverEarnings, createDriverPayout } from "../services/earnings.service.js";

export const getMyEarnings = async (req, res, next) => {
  try {
    const data = await getDriverEarnings(req.user.userId, req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const requestPayout = async (req, res, next) => {
  try {
    const data = await createDriverPayout(req.user.userId, req.body.amount);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};
