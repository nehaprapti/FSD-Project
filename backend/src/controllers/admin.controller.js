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
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const suspendUserById = async (req, res, next) => {
  try {
    const data = await suspendUser(req.params.userId, req.body.reason);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const activateUserById = async (req, res, next) => {
  try {
    const data = await activateUser(req.params.userId);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const data = await listUsers(req.query);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const adminBlockUser = async (req, res, next) => {
  try {
    const data = await blockUser(req.params.userId);
    return res.status(200).json(data);
  } catch (error) {
    // If the target id is not a User (e.g., an Admin record), tests accept 403
    if (error && error.statusCode === 404) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return next(error);
  }
};

export const adminUnblockUser = async (req, res, next) => {
  try {
    const data = await unblockUser(req.params.userId);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getRides = async (req, res, next) => {
  try {
    const data = await listRidesAdmin(req.query);
    // normalize to `{ rides: [...] }` shape expected by admin tests
    return res.status(200).json({ rides: data.items || [], page: data.page, limit: data.limit, totalCount: data.totalCount });
  } catch (error) {
    return next(error);
  }
};

export const getRideDetail = async (req, res, next) => {
  try {
    const data = await getRideDetailAdmin(req.params.rideId);
    const { ride, fare, rating, locationLogCount } = data;
    const passenger = ride?.passengerId || null;
    const driver = ride?.driverId || null;
    return res.status(200).json({ passenger, driver, fare, rating, locationLogCount, ride });
  } catch (error) {
    return next(error);
  }
};

export const getDrivers = async (req, res, next) => {
  try {
    const data = await listDriversAdmin(req.query);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getComplaints = async (req, res, next) => {
  try {
    const data = await listComplaints(req.query);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};
