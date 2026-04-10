import { signupPassenger, signupDriver, loginUser, loginAdmin, verifyOtpEmail } from "../services/auth.service.js";

export const signupPassengerController = async (req, res, next) => {
  try {
    const data = await signupPassenger(req.body);
    return res.status(201).json({ success: true, ...data });
  } catch (error) {
    return next(error);
  }
};

export const signupDriverController = async (req, res, next) => {
  try {
    const data = await signupDriver(req.body);
    return res.status(201).json({ success: true, ...data });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await loginUser(req.body);
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    return next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const data = await loginAdmin(req.body);
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    return next(error);
  }
};

export const verifyOtpController = async (req, res, next) => {
  try {
    const data = await verifyOtpEmail(req.body);
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    return next(error);
  }
};
