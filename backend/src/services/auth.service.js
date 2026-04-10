import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Passenger from "../models/passenger.model.js";
import Driver from "../models/driver.model.js";
import { generateAccessToken } from "../utils/token.js";
import env from "../config/env.js";
import { sendEmail } from "./mail.service.js";

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
  status: user.status,
});

const createToken = ({ user, extraClaims = {} }) => {
  return generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
    ...extraClaims,
  });
};

const assertUniqueEmail = async (email) => {
  if (typeof email !== "string") {
    throw makeError("Invalid email", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw makeError("Email already registered", 409);
  }
};

export const signupPassenger = async (payload) => {
  const {
    name,
    email,
    password,
    phone,
    savedLocations = [],
    preferences = {},
  } = payload;

  if (typeof password !== "string") {
    throw makeError("Invalid password", 400);
  }

  await assertUniqueEmail(email);

  const passwordHash = await bcrypt.hash(password, 10);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
    passwordHash,
    role: "passenger",
    status: "pending",
    otp,
    otpExpires,
  });

  try {
    const passenger = await Passenger.create({
      userId: user._id,
      savedLocations,
      preferences,
      tripHistory: [],
    });

    await sendEmail({
      to: user.email,
      subject: "Verify your Rider Hub Account",
      text: `Your OTP for Rider Hub registration is: ${otp}. It will expire in 10 minutes.`,
      html: `<h1>Welcome to Rider Hub!</h1><p>Thank you for signing up. Your OTP for registration is:</p><h2 style="color: #FFD600; font-size: 32px; letter-spacing: 5px;">${otp}</h2><p>This code will expire in 10 minutes.</p>`,
    });

    return {
      message: "OTP sent to your email",
      userId: user._id,
      email: user.email,
    };
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }
};

export const signupDriver = async (payload) => {
  const {
    name,
    email,
    password,
    phone,
    vehicleInfo: _vehicleInfo,
    licenseInfo,
    currentLocation,
    vehicle,
  } = payload;

  if (typeof password !== "string") {
    throw makeError("Invalid password", 400);
  }

  await assertUniqueEmail(email);

  const passwordHash = await bcrypt.hash(password, 10);

  const vehicleInfo = _vehicleInfo ?? vehicle ?? {};

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
    passwordHash,
    role: "driver",
    status: "pending",
    otp,
    otpExpires,
  });

  try {
    const filledVehicleInfo = {
      make: vehicleInfo.make ?? "Unknown",
      model: vehicleInfo.model ?? "Unknown",
      plate: vehicleInfo.plate ?? "UNKNOWN",
      color: vehicleInfo.color ?? "Unknown",
      seats: vehicleInfo.seats ?? 4,
    };

    const filledLicenseInfo = licenseInfo ?? {
      number: "UNKNOWN",
      expiry: new Date("2100-01-01"),
    };

    const driver = await Driver.create({
      _id: user._id,
      userId: user._id,
      vehicleInfo: filledVehicleInfo,
      licenseInfo: filledLicenseInfo,
      verificationStatus: "pending",
      availabilityStatus: false,
      currentLocation,
      averageRating: 0,
      totalTrips: 0,
    });

    await sendEmail({
      to: user.email,
      subject: "Verify your Rider Hub Driver Account",
      text: `Your OTP for Rider Hub driver registration is: ${otp}. It will expire in 10 minutes.`,
      html: `<h1>Welcome to Rider Hub!</h1><p>Thank you for applying as a driver. Your OTP for registration is:</p><h2 style="color: #FFD600; font-size: 32px; letter-spacing: 5px;">${otp}</h2><p>This code will expire in 10 minutes.</p>`,
    });

    return {
      message: "OTP sent to your email",
      userId: user._id,
      email: user.email,
    };
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  if (typeof email !== "string" || typeof password !== "string") {
    throw makeError("Invalid credentials", 400);
  }

  // Check against .env credentials (master override)
  if (email === env.adminUser && password === env.adminPass) {
    return loginAdmin(payload);
  }

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
      driverVerificationStatus: driver?.verificationStatus ?? "pending",
    };
  }

  return {
    user: sanitizeUser(user),
    token: createToken({ user }),
  };
};

export const loginAdmin = async (payload) => {
  const { email, password } = payload;
  if (typeof email !== "string" || typeof password !== "string") {
    throw makeError("Invalid credentials", 400);
  }

  // Check against .env credentials
  if (email === env.adminUser && password === env.adminPass) {
    // Return a virtual admin user or find/create one in DB
    let user = await User.findOne({
      email: email.toLowerCase(),
      role: "admin",
    });
    if (!user) {
      // Create a virtual user object for the token
      user = {
        _id: "admin-id", // Placeholder
        name: "Administrator",
        email: email.toLowerCase(),
        role: "admin",
        status: "active",
      };

      return {
        user: sanitizeUser({ ...user, _id: "admin-id" }), // Pass something that sanitizeUser can handle
        token: generateAccessToken({ userId: "admin-id", role: "admin" }),
      };
    }

    return {
      user: sanitizeUser(user),
      token: createToken({ user }),
    };
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
    role: "admin",
  });
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
    token: createToken({ user }),
  };
};

export const verifyOtpEmail = async ({ userId, otp }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw makeError("User not found", 404);
  }

  if (user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
    throw makeError("Invalid or expired OTP", 400);
  }

  user.status = "active";
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  return {
    user: sanitizeUser(user),
    token: createToken({ user }),
  };
};
