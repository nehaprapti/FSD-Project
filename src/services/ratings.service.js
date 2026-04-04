import mongoose from "mongoose";
import Rating from "../models/rating.model.js";
import Ride from "../models/ride.model.js";
import Driver from "../models/driver.model.js";

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const updateDriverAverageRatingOnWrite = async (driverUserId) => {
  const [aggregate] = await Rating.aggregate([
    {
      $match: {
        ratedId: new mongoose.Types.ObjectId(driverUserId)
      }
    },
    {
      $group: {
        _id: "$ratedId",
        averageRating: { $avg: "$score" }
      }
    }
  ]);

  const nextAverage = aggregate ? Number(aggregate.averageRating.toFixed(2)) : 0;

  await Driver.findOneAndUpdate(
    { userId: driverUserId },
    {
      $set: {
        averageRating: nextAverage
      }
    }
  );
};

const resolveRatingDirection = ({ ride, raterId, raterRole }) => {
  const passengerId = String(ride.passengerId);
  const driverId = String(ride.driverId || "");
  const raterIdText = String(raterId);

  if (raterRole === "passenger") {
    if (raterIdText !== passengerId) {
      throw makeError("Passenger can only rate rides they took", 403);
    }

    if (!driverId) {
      throw makeError("Driver is not assigned for this ride", 400);
    }

    return {
      ratedId: driverId,
      ratedRole: "driver"
    };
  }

  if (raterRole === "driver") {
    if (raterIdText !== driverId) {
      throw makeError("Driver can only rate rides they drove", 403);
    }

    return {
      ratedId: passengerId,
      ratedRole: "passenger"
    };
  }

  throw makeError("Only passenger or driver can submit ratings", 403);
};

export const submitRideRating = async ({ rideId, raterId, raterRole, score, reviewText }) => {
  if (!Number.isInteger(Number(score)) || Number(score) < 1 || Number(score) > 5) {
    throw makeError("score must be an integer between 1 and 5", 400);
  }

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw makeError("Ride not found", 404);
  }

  if (ride.status !== "trip_completed") {
    throw makeError("Rating can only be submitted after trip_completed", 400);
  }

  const { ratedId, ratedRole } = resolveRatingDirection({
    ride,
    raterId,
    raterRole
  });

  try {
    const rating = await Rating.create({
      rideId,
      raterId,
      ratedId,
      raterRole,
      score: Number(score),
      reviewText
    });

    if (ratedRole === "driver") {
      await updateDriverAverageRatingOnWrite(ratedId);
    }

    return rating;
  } catch (error) {
    if (error?.code === 11000) {
      throw makeError(
        "Duplicate rating: this ride already has a rating from this role direction",
        409
      );
    }

    throw error;
  }
};

export const getDriverRatingsWithSummary = async (driverId) => {
  const [ratings, driverProfile, totalRatings] = await Promise.all([
    Rating.find({ ratedId: driverId, raterRole: "passenger" })
      .populate("rideId", "status pickup drop")
      .populate("raterId", "name email phone")
      .sort({ createdAt: -1 }),
    Driver.findOne({ userId: driverId }).select("averageRating").lean(),
    Rating.countDocuments({ ratedId: driverId, raterRole: "passenger" })
  ]);

  return {
    driverId,
    summary: {
      averageScore: Number(driverProfile?.averageRating || 0),
      totalRatings
    },
    ratings
  };
};

export const getRideRatings = async (rideId) => {
  return Rating.find({ rideId })
    .populate("raterId", "name email phone")
    .populate("ratedId", "name email phone")
    .sort({ createdAt: -1 });
};

// Backward-compatible aliases.
export const createRating = submitRideRating;
export const getDriverRatingSummary = getDriverRatingsWithSummary;
