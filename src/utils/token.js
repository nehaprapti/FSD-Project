import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const generateAccessToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};
