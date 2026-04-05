import {
  submitRideRating,
  getDriverRatingsWithSummary,
  getRideRatings
} from "../services/ratings.service.js";

export const rateRide = async (req, res, next) => {
  try {
    const payload = {
      rideId: req.body.rideId,
      raterId: req.user.userId,
      raterRole: req.user.role,
      score: req.body.score,
      reviewText: req.body.reviewText
    };

    const data = await submitRideRating(payload);
    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getDriverRatings = async (req, res, next) => {
  try {
    const data = await getDriverRatingsWithSummary(req.params.driverId);
    const summary = data.summary || {};
    return res.status(200).json({
      driverId: data.driverId,
      ratings: data.ratings || [],
      averageRating: summary.averageScore || 0,
      totalRatings: summary.totalRatings || 0
    });
  } catch (error) {
    return next(error);
  }
};

export const getRatingsByRide = async (req, res, next) => {
  try {
    const data = await getRideRatings(req.params.rideId);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};
