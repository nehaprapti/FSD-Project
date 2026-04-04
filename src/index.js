import http from "node:http";
import mongoose from "mongoose";
import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./config/socket.js";
import app from "./app.js";

const httpServer = http.createServer(app);
const io = initSocket(httpServer);
app.set("io", io);

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(env.port, () => {
      console.log(`Server + Socket.IO running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  console.log("Shutting down server...");

  httpServer.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

startServer();
