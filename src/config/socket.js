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
  // Ensure requests aimed at '/api/socket.io' are rewritten to '/socket.io'
  // before engine.io/socket.io handles them. This allows clients that use
  // the API base path (e.g. 'http://host:port/api') to connect without
  // requiring multiple Server instances.
  if (!httpServer.__socket_rewrite_installed) {
    httpServer.__socket_rewrite_installed = true;
    httpServer.on("request", (req) => {
      try {
        if (req.url && req.url.startsWith("/api/socket.io")) {
          // debug: log rewrite hits to help diagnose intermittent client behavior
          if (process.env.NODE_ENV !== "production") {
            console.debug("[socket] rewriting request", req.url);
          }
          req.url = req.url.replace("/api/socket.io", "/socket.io");
        } else if (req.url && req.url.startsWith("/socket.io")) {
          if (process.env.NODE_ENV !== "production") {
            console.debug("[socket] request to root socket path", req.url);
          }
        }
      } catch (e) {
        // ignore
      }
    });
    // log upgrade requests (WebSocket handshake) for debugging
    httpServer.on("upgrade", (req, socket, head) => {
      try {
        if (process.env.NODE_ENV !== "production") {
          console.debug("[socket] upgrade request", req.url);
        }
      } catch (e) {}
    });
  }

  const io = new Server(httpServer, {
    path: "/socket.io",
    cors: {
      origin: getAllowedOrigins(),
      methods: ["GET", "POST", "PATCH", "DELETE"]
    }
  });

  setSocketServer(io);
  registerSocketHandlers(io);
  return io;
};
