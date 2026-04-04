import { Server } from "socket.io";
import env from "./env.js";
import { registerSocketHandlers } from "../sockets/index.js";
import { setSocketServer } from "../sockets/socketRegistry.js";

const getAllowedOrigins = () => {
  if (env.corsOrigin === "*") {
    return true;
  }

  return env.corsOrigin.split(",").map((origin) => origin.trim());
};

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: getAllowedOrigins(),
      methods: ["GET", "POST", "PATCH", "DELETE"]
    }
  });

  setSocketServer(io);
  registerSocketHandlers(io);
  return io;
};
