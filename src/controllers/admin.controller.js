import { getDashboardSummary, suspendUser, activateUser } from "../services/admin.service.js";

export const getDashboard = async (req, res, next) => {
  try {
    const data = await getDashboardSummary();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const suspendUserById = async (req, res, next) => {
  try {
    const data = await suspendUser(req.params.userId, req.body.reason);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const activateUserById = async (req, res, next) => {
  try {
    const data = await activateUser(req.params.userId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};
