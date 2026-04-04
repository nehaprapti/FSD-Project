import User from "../models/user.model.js";
import Ride from "../models/ride.model.js";
import { getRideAnalytics, getRevenueAnalytics } from "./analytics.service.js";

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const getDashboardSummary = async () => {
  const [usersCount, ridesCount, rideAnalytics, revenueAnalytics] = await Promise.all([
    User.countDocuments(),
    Ride.countDocuments(),
    getRideAnalytics({}),
    getRevenueAnalytics({})
  ]);

  return {
    usersCount,
    ridesCount,
    rideAnalytics,
    revenueAnalytics
  };
};

export const suspendUser = async (userId, reason) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        isActive: false
      }
    },
    { new: true }
  ).select("-password");

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
        isActive: true
      }
    },
    { new: true }
  ).select("-password");

  if (!user) {
    throw makeError("User not found", 404);
  }

  return user;
};
