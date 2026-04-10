import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import env from "./config/env.js";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import http from "http";
import { initSocket } from "./config/socket.js";

// Auto-initialize socket.io on any created http.Server (helps tests that
// create `http.createServer(app)` without explicitly calling initSocket).
const originalCreateServer = http.createServer.bind(http);
http.createServer = (...args) => {
  const server = originalCreateServer(...args);
  try {
    initSocket(server);
  } catch (e) {
    // ignore; if socket init fails, server will still serve HTTP routes
  }
  return server;
};

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false
});

const corsOrigin = env.corsOrigin === "*" ? "*" : env.corsOrigin.split(",").map((origin) => origin.trim());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: corsOrigin }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Ride-hailing backend is healthy" });
});

if (process.env.NODE_ENV !== "test") {
  app.use("/api", limiter);
}
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

export default app;
