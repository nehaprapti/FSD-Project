import User from "../models/user.model.js";

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const listDrivers = async ({ isOnline }) => {
  const query = { role: "driver" };
  if (isOnline !== undefined) {
    query["driverProfile.isOnline"] = isOnline === true || isOnline === "true";
  }

  return User.find(query).select("-password").sort({ createdAt: -1 });
};

export const getDriverProfile = async (driverId) => {
  const driver = await User.findOne({ _id: driverId, role: "driver" }).select("-password");
  if (!driver) {
    throw makeError("Driver not found", 404);
  }

  return driver;
};

export const updateDriverAvailability = async (driverId, isOnline) => {
  const driver = await User.findOneAndUpdate(
    { _id: driverId, role: "driver" },
    { $set: { "driverProfile.isOnline": Boolean(isOnline) } },
    { new: true }
  ).select("-password");

  if (!driver) {
    throw makeError("Driver not found", 404);
  }

  return driver;
};
