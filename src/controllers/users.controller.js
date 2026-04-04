import { listUsers, getUserProfile, updateUserProfile } from "../services/users.service.js";

export const getUsers = async (req, res, next) => {
  try {
    const data = await listUsers(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const data = await getUserProfile(req.user.userId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const data = await updateUserProfile(req.user.userId, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};
