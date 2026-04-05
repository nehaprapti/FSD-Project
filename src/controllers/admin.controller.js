import {
  getDashboardSummary,
  suspendUser,
  activateUser,
  listUsers,
  blockUser,
  unblockUser,
  listRidesAdmin,
  getRideDetailAdmin,
  listDriversAdmin,
  listComplaints
} from "../services/admin.service.js";

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

export const getUsers = async (req, res, next) => {
  try {
    const data = await listUsers(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const adminBlockUser = async (req, res, next) => {
  try {
    const data = await blockUser(req.params.userId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const adminUnblockUser = async (req, res, next) => {
  try {
    const data = await unblockUser(req.params.userId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getRides = async (req, res, next) => {
  try {
    const data = await listRidesAdmin(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getRideDetail = async (req, res, next) => {
  try {
    const data = await getRideDetailAdmin(req.params.rideId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getDrivers = async (req, res, next) => {
  try {
    const data = await listDriversAdmin(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getComplaints = async (req, res, next) => {
  try {
    const data = await listComplaints(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};
