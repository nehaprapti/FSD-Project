import User from "../models/user.model.js";
import Ride from "../models/ride.model.js";
import { getRideAnalytics, getRevenueAnalytics } from "./analytics.service.js";
import Driver from "../models/driver.model.js";
import LocationLog from "../models/locationLog.model.js";
import Rating from "../models/rating.model.js";

const toInt = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
};

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const getDashboardSummary = async () => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [totalUsers, totalDrivers, activeDriversNow, ongoingRides, revenueAgg, todayRevenueAgg] = await Promise.all([
    User.countDocuments(),
    Driver.countDocuments(),
    Driver.countDocuments({ availabilityStatus: true }),
    Ride.countDocuments({ status: { $nin: ["trip_completed", "cancelled_by_passenger", "cancelled_by_driver", "no_driver_found"] } }),
    Ride.aggregate([{ $match: { finalFare: { $exists: true, $ne: null } } }, { $group: { _id: null, total: { $sum: "$finalFare" } } }]),
    Ride.aggregate([
      { $match: { finalFare: { $exists: true, $ne: null }, createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, total: { $sum: "$finalFare" } } }
    ])
  ]);

  const totalRevenue = (revenueAgg[0] && revenueAgg[0].total) || 0;
  const todayRevenue = (todayRevenueAgg[0] && todayRevenueAgg[0].total) || 0;

  return {
    totalUsers,
    totalDrivers,
    activeDriversNow,
    ongoingRides,
    totalRevenue,
    todayRevenue
  };
};

export const suspendUser = async (userId, reason) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        status: "blocked"
      }
    },
    { new: true }
  ).select("-passwordHash");

  if (!user) {
    throw makeError("User not found", 404);
  }

  return {
    user,
    reason
  };
};

export const activateUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        status: "active"
      }
    },
    { new: true }
  ).select("-passwordHash");

  if (!user) {
    throw makeError("User not found", 404);
  }

  return user;
};

export const listUsers = async ({ page = 1, limit = 20, role, status, search } = {}) => {
  const p = toInt(page, 1);
  const l = toInt(limit, 20);

  const query = {};
  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ name: rx }, { email: rx }];
  }

  const [items, totalCount] = await Promise.all([
    User.find(query).select("-passwordHash").sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
    User.countDocuments(query)
  ]);

  return { items, totalCount, page: p, limit: l };
};

export const blockUser = async (userId) => {
  const user = await User.findByIdAndUpdate(userId, { $set: { status: "blocked" } }, { new: true }).select(
    "-passwordHash"
  );
  if (!user) throw makeError("User not found", 404);
  return user;
};

export const unblockUser = async (userId) => {
  const user = await User.findByIdAndUpdate(userId, { $set: { status: "active" } }, { new: true }).select(
    "-passwordHash"
  );
  if (!user) throw makeError("User not found", 404);
  return user;
};

export const listRidesAdmin = async ({ page = 1, limit = 20, status, from, to, driverId, passengerId } = {}) => {
  const p = toInt(page, 1);
  const l = toInt(limit, 20);

  const query = {};
  if (status) query.status = status;
  if (from || to) query.createdAt = {};
  if (from) query.createdAt.$gte = new Date(from);
  if (to) query.createdAt.$lte = new Date(to);
  if (driverId) query.driverId = driverId;
  if (passengerId) query.passengerId = passengerId;

  const [items, totalCount] = await Promise.all([
    Ride.find(query).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).populate("driverId passengerId", "name email phone"),
    Ride.countDocuments(query)
  ]);

  return { items, totalCount, page: p, limit: l };
};

export const getRideDetailAdmin = async (rideId) => {
  const ride = await Ride.findById(rideId).populate("passengerId", "name email phone").populate("driverId", "name email phone").lean();
  if (!ride) throw makeError("Ride not found", 404);

  const [locationLogCount, rating] = await Promise.all([
    LocationLog.countDocuments({ rideId: ride._id }),
    Rating.findOne({ rideId: ride._id }).lean()
  ]);

  return {
    ride,
    locationLogCount,
    fare: {
      estimatedFare: ride.estimatedFare,
      finalFare: ride.finalFare,
      distanceKm: ride.distanceKm,
      actualDurationMin: ride.actualDurationMin,
      surgeMultiplier: ride.surgeMultiplier
    },
    rating
  };
};

export const listDriversAdmin = async ({ page = 1, limit = 50 } = {}) => {
  const p = toInt(page, 1);
  const l = toInt(limit, 50);

  const [items, totalCount] = await Promise.all([
    Driver.find({}).populate("userId", "name email phone").sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
    Driver.countDocuments({})
  ]);

  return { items, totalCount, page: p, limit: l };
};

export const listComplaints = async ({ page = 1, limit = 50 } = {}) => {
  const p = toInt(page, 1);
  const l = toInt(limit, 50);

  const query = { score: { $lt: 3 } };
  const [items, totalCount] = await Promise.all([
    Rating.find(query).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).lean(),
    Rating.countDocuments(query)
  ]);

  return { items, totalCount, page: p, limit: l };
};

export const deleteUserById = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw makeError("User not found", 404);
  
  // If driver, also clear driver profile
  if (user.role === 'driver') {
    await Driver.findOneAndDelete({ userId });
  }
  
  return { success: true, message: "User deleted successfully" };
};
