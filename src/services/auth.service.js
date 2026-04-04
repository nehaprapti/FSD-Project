import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Passenger from "../models/passenger.model.js";
import Driver from "../models/driver.model.js";
import { generateAccessToken } from "../utils/token.js";

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  status: user.status
});

const createToken = ({ user, extraClaims = {} }) => {
  return generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
    ...extraClaims
  });
};

const assertUniqueEmail = async (email) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw makeError("Email already registered", 409);
  }
};

export const signupPassenger = async (payload) => {
  const { name, email, password, phone, savedLocations = [], preferences = {} } = payload;

  await assertUniqueEmail(email);

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
    passwordHash,
    role: "passenger",
    status: "active"
  });

  try {
    const passenger = await Passenger.create({
      userId: user._id,
      savedLocations,
      preferences,
      tripHistory: []
    });

    return {
      user: sanitizeUser(user),
      passenger,
      token: createToken({ user })
    };
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }
};

export const signupDriver = async (payload) => {
  const { name, email, password, phone, vehicleInfo, licenseInfo, currentLocation } = payload;

  await assertUniqueEmail(email);

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
    passwordHash,
    role: "driver",
    status: "active"
  });

  try {
    const driver = await Driver.create({
      userId: user._id,
      vehicleInfo,
      licenseInfo,
      verificationStatus: "pending",
      availabilityStatus: false,
      currentLocation,
      averageRating: 0,
      totalTrips: 0
    });

    return {
      user: sanitizeUser(user),
      driver,
      token: createToken({ user, extraClaims: { isVerifiedDriver: false } })
    };
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }
};

export const loginUser = async (payload) => {
  const { email, password } = payload;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw makeError("Invalid credentials", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw makeError("Invalid credentials", 401);
  }

  if (user.role === "driver" && user.status === "blocked") {
    throw makeError("Blocked driver account cannot log in", 403);
  }

  if (user.status === "blocked") {
    throw makeError("User account is blocked", 403);
  }

  if (user.role === "driver") {
    const driver = await Driver.findOne({ userId: user._id });
    const isVerifiedDriver = driver?.verificationStatus === "approved";

    return {
      user: sanitizeUser(user),
      token: createToken({ user, extraClaims: { isVerifiedDriver } }),
      limitedAccess: !isVerifiedDriver,
      driverVerificationStatus: driver?.verificationStatus ?? "pending"
    };
  }

  return {
    user: sanitizeUser(user),
    token: createToken({ user })
  };
};

export const loginAdmin = async (payload) => {
  const { email, password } = payload;

  const user = await User.findOne({ email: email.toLowerCase(), role: "admin" });
  if (!user) {
    throw makeError("Invalid credentials", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw makeError("Invalid credentials", 401);
  }

  if (user.status === "blocked") {
    throw makeError("Admin account is blocked", 403);
  }

  return {
    user: sanitizeUser(user),
    token: createToken({ user })
  };
};
