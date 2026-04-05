import Earning from "../models/earning.model.js";
import PRICING_CONFIG from "../config/pricing.js";
import mongoose from "mongoose";

const round2 = (v) => Math.round(v * 100) / 100;

export const getDriverEarningsSummary = async (driverId, period = "month") => {
  const now = new Date();
  let start;

  if (period === "today") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === "week") {
    const day = now.getDay();
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
  } else {
    // month
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const match = {
    driverId: new mongoose.Types.ObjectId(String(driverId)),
    createdAt: { $gte: start, $lte: now }
  };

  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: "$driverId",
        totalGross: { $sum: "$grossAmount" },
        totalCommission: { $sum: "$commissionAmount" },
        totalNet: { $sum: "$netAmount" },
        totalRides: { $sum: 1 }
      }
    }
  ];

  const agg = await Earning.aggregate(pipeline);
  const totals = (agg[0] && {
    totalGross: round2(agg[0].totalGross || 0),
    totalCommission: round2(agg[0].totalCommission || 0),
    totalNet: round2(agg[0].totalNet || 0),
    totalRides: agg[0].totalRides || 0
  }) || { totalGross: 0, totalCommission: 0, totalNet: 0, totalRides: 0 };

  // pending payout (across matched period)
  const pendingAgg = await Earning.aggregate([
    { $match: { driverId: new mongoose.Types.ObjectId(String(driverId)), payoutStatus: "pending", createdAt: { $gte: start, $lte: now } } },
    { $group: { _id: "$driverId", pendingPayout: { $sum: "$netAmount" } } }
  ]);

  totals.pendingPayout = round2((pendingAgg[0] && pendingAgg[0].pendingPayout) || 0);

  return totals;
};

export const getDriverTrips = async (driverId, { page = 1, limit = 20 } = {}) => {
  const p = Math.max(1, Number(page));
  const l = Math.max(1, Math.min(200, Number(limit)));

  const query = { driverId: new mongoose.Types.ObjectId(String(driverId)) };

  const [items, total] = await Promise.all([
    Earning.find(query)
      .populate("rideId", "status pickup drop finalFare estimatedFare")
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .lean(),
    Earning.countDocuments(query)
  ]);

  return {
    items,
    page: p,
    limit: l,
    total
  };
};

export const adminListPendingPayouts = async ({ page = 1, limit = 50 } = {}) => {
  const p = Math.max(1, Number(page));
  const l = Math.max(1, Math.min(500, Number(limit)));

  const pipeline = [
    { $match: { payoutStatus: "pending" } },
    {
      $group: {
        _id: "$driverId",
        pendingAmount: { $sum: "$netAmount" },
        count: { $sum: 1 },
        earnings: { $push: { _id: "$_id", rideId: "$rideId", grossAmount: "$grossAmount", netAmount: "$netAmount", createdAt: "$createdAt" } }
      }
    },
    { $sort: { pendingAmount: -1 } },
    { $skip: (p - 1) * l },
    { $limit: l }
  ];

  const list = await Earning.aggregate(pipeline);
  return { items: list, page: p, limit: l };
};

export const markEarningPaid = async (earningId, { paidAt = new Date() } = {}) => {
  const updated = await Earning.findOneAndUpdate(
    { _id: earningId },
    { $set: { payoutStatus: "paid", payoutDate: paidAt } },
    { new: true }
  );

  if (!updated) {
    const err = new Error("Earning record not found");
    err.statusCode = 404;
    throw err;
  }

  return updated;
};

export default {
  getDriverEarningsSummary,
  getDriverTrips,
  adminListPendingPayouts,
  markEarningPaid
};
