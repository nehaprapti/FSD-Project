import { registerDriverSocketHandlers } from "./driver.js";
import { registerPassengerSocketHandlers } from "./passenger.js";
import { registerAdminSocketHandlers } from "./admin.js";
import { registerSocketConnection, unregisterSocketConnection } from "./socketRegistry.js";
import { socketAuth } from "../middlewares/auth.js";

export const registerSocketHandlers = (io) => {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const role = socket.role;
    const userId = socket.userId;

    registerSocketConnection({
      socketId: socket.id,
      role,
      userId: String(userId)
    });

    if (role === "driver") {
      registerDriverSocketHandlers(io, socket);
    } else if (role === "passenger") {
      registerPassengerSocketHandlers(io, socket);
    } else if (role === "admin") {
      registerAdminSocketHandlers(io, socket);
    }

    socket.emit("socket:connected", {
      socketId: socket.id,
      userId,
      role: role || "guest"
    });

    socket.on("disconnect", () => {
      unregisterSocketConnection(socket.id);
    });
  });
};
