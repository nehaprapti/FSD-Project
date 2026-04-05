import { Router } from "express";
import authRoutes from "./auth.routes.js";
import ridesRoutes from "./rides.routes.js";
import usersRoutes from "./users.routes.js";
import driversRoutes from "./drivers.routes.js";
import passengersRoutes from "./passengers.routes.js";
import ratingsRoutes from "./ratings.routes.js";
import earningsRoutes from "./earnings.routes.js";
import verificationRoutes from "./verification.routes.js";
import pricingRoutes from "./pricing.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/rides", ridesRoutes);
router.use("/users", usersRoutes);
router.use("/drivers", driversRoutes);
router.use("/passengers", passengersRoutes);
router.use("/ratings", ratingsRoutes);
router.use("/earnings", earningsRoutes);
router.use("/verification", verificationRoutes);
router.use("/pricing", pricingRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/admin", adminRoutes);

export default router;
