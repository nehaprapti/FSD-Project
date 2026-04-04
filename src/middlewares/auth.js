import { verifyAccessToken } from "../utils/token.js";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: token missing" });
    }

    req.user = verifyAccessToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: invalid token" });
  }
};

export const authCheck = protect;

export const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake?.auth?.token;
    if (!token) {
      return next(new Error("Unauthorized: token missing"));
    }

    const decoded = verifyAccessToken(token);
    if (!decoded?.userId || !decoded?.role) {
      return next(new Error("Unauthorized: token payload missing user context"));
    }

    socket.user = decoded;
    socket.userId = decoded.userId;
    socket.role = decoded.role;
    return next();
  } catch (error) {
    return next(new Error("Unauthorized: invalid token"));
  }
};
