import Ride from "../models/ride.model.js";
import Earning from "../models/earning.model.js";

export const getRideAnalytics = async ({ startDate, endDate }) => {
  const dateMatch = {};
  if (startDate) {
    dateMatch.$gte = new Date(startDate);
  }
  if (endDate) {
    dateMatch.$lte = new Date(endDate);
  }

  const matchStage = Object.keys(dateMatch).length > 0 ? { createdAt: dateMatch } : {};

  const byStatus = await Ride.aggregate([
    { $match: matchStage },
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  return { byStatus };
};

export const getRevenueAnalytics = async ({ startDate, endDate }) => {
  const dateMatch = {};
  if (startDate) {
    dateMatch.$gte = new Date(startDate);
  }
  if (endDate) {
    dateMatch.$lte = new Date(endDate);
  }

  const matchStage = Object.keys(dateMatch).length > 0 ? { createdAt: dateMatch } : {};

  const totals = await Earning.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        grossFare: { $sum: "$grossFare" },
        platformFee: { $sum: "$platformFee" },
        driverPayout: { $sum: "$driverPayout" }
      }
    }
  ]);

  return totals[0] || { grossFare: 0, platformFee: 0, driverPayout: 0 };
};
