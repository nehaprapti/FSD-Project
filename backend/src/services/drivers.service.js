import User from "../models/user.model.js";
import Driver from "../models/driver.model.js";

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const listDrivers = async ({ isOnline }) => {
  const query = {};
  if (isOnline !== undefined) {
    query.availabilityStatus = isOnline === true || isOnline === "true";
  }

  return Driver.find(query).populate("userId", "-passwordHash").sort({ createdAt: -1 });
};

export const getDriverProfile = async (driverId) => {
  const driver = await Driver.findOne({ userId: driverId }).populate("userId", "-passwordHash");
  if (!driver) {
    throw makeError("Driver profile not found", 404);
  }

  return driver;
};

export const updateDriverAvailability = async (driverId, isOnline) => {
  const driver = await Driver.findOneAndUpdate(
    { userId: driverId },
    { $set: { availabilityStatus: Boolean(isOnline) } },
    { new: true }
  ).populate("userId", "-passwordHash");

  if (!driver) {
    throw makeError("Driver profile not found", 404);
  }

  return driver;
};

export const updateDriverProfile = async (driverId, updateData) => {
  const { name, phone, vehicleInfo, licenseInfo } = updateData;

  // Update User info if name or phone provided
  if (name || phone) {
    const userUpdate = {};
    if (name) userUpdate.name = name;
    if (phone) userUpdate.phone = phone;
    await User.findByIdAndUpdate(driverId, { $set: userUpdate });
  }

  // Update Driver info
  const driverUpdate = {};
  if (vehicleInfo) driverUpdate.vehicleInfo = vehicleInfo;
  if (licenseInfo) driverUpdate.licenseInfo = licenseInfo;

  const driver = await Driver.findOneAndUpdate(
    { userId: driverId },
    { $set: driverUpdate },
    { new: true, runValidators: true }
  ).populate("userId", "-passwordHash");

  if (!driver) {
    throw makeError("Driver profile not found", 404);
  }

  return driver;
};
