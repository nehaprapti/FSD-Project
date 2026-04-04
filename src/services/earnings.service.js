import Earning from "../models/earning.model.js";

export const getDriverEarnings = async (driverId, { startDate, endDate }) => {
  const query = { driver: driverId };

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  const [records, totals] = await Promise.all([
    Earning.find(query).populate("ride", "status pickup drop finalFare estimatedFare").sort({ createdAt: -1 }),
    Earning.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$driver",
          grossFare: { $sum: "$grossFare" },
          platformFee: { $sum: "$platformFee" },
          payout: { $sum: "$driverPayout" }
        }
      }
    ])
  ]);

  return {
    records,
    totals: totals[0] || { grossFare: 0, platformFee: 0, payout: 0 }
  };
};

export const createDriverPayout = async (driverId, amount) => {
  return {
    driverId,
    amount,
    status: "queued",
    message: "Payout request queued for processing"
  };
};
