import User from "../models/user.model.js";
import Ride from "../models/ride.model.js";

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const listPassengers = async () => {
  return User.find({ role: "passenger" }).select("-password").sort({ createdAt: -1 });
};

export const getPassengerProfile = async (passengerId) => {
  const passenger = await User.findOne({ _id: passengerId, role: "passenger" }).select("-password");
  if (!passenger) {
    throw makeError("Passenger not found", 404);
  }

  return passenger;
};

export const getPassengerRideHistory = async (passengerId) => {
  return Ride.find({ passengerId })
    .populate("driverId", "name email phone")
    .sort({ createdAt: -1 });
};
