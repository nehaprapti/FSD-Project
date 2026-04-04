import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import env from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false
});

const corsOrigin = env.corsOrigin === "*" ? "*" : env.corsOrigin.split(",").map((origin) => origin.trim());

app.use(helmet());
app.use(cors({ origin: corsOrigin }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Ride-hailing backend is healthy" });
});

app.use("/api", limiter);
app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

export default app;
