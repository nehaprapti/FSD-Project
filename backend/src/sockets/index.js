import { registerDriverSocketHandlers } from "./driver.js";
import { registerPassengerSocketHandlers } from "./passenger.js";
import { registerAdminSocketHandlers } from "./admin.js";
import { registerSocketConnection, unregisterSocketConnection } from "./socketRegistry.js";
import { socketAuth } from "../middlewares/auth.js";

export const registerSocketHandlers = (io) => {
  const attachHandlers = (namespaceIo) => {
    namespaceIo.use(socketAuth);

    namespaceIo.on("connection", (socket) => {
      const role = socket.role;
      const userId = socket.userId;

      registerSocketConnection({
        socketId: socket.id,
        role,
        userId: String(userId),
        namespace: socket.nsp.name
      });

      if (role === "driver") {
        registerDriverSocketHandlers(namespaceIo, socket);
      } else if (role === "passenger") {
        registerPassengerSocketHandlers(namespaceIo, socket);
      } else if (role === "admin") {
        registerAdminSocketHandlers(namespaceIo, socket);
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

  // Attach to root namespace
  attachHandlers(io);

  // Also attach to '/api' namespace to support clients connecting to the API base path
  try {
    attachHandlers(io.of('/api'));
  } catch (e) {
    // ignore if namespace attach not supported in this environment
  }
};
