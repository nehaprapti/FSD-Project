import User from "../models/user.model.js";

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const listUsers = async ({ role, page = 1, limit = 20 }) => {
  const query = role ? { role } : {};
  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    User.find(query).select("-password").skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    User.countDocuments(query)
  ]);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit)
    }
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw makeError("User not found", 404);
  }

  return user;
};

export const updateUserProfile = async (userId, payload) => {
  const allowedFields = ["name", "phone"];
  const updateData = {};

  for (const field of allowedFields) {
    if (payload[field] !== undefined) {
      updateData[field] = payload[field];
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true
  }).select("-password");

  if (!updatedUser) {
    throw makeError("User not found", 404);
  }

  return updatedUser;
};
