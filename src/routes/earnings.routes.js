import { Router } from "express";
import { getEarningsSummary, getEarningsTrips } from "../controllers/earnings.controller.js";
import { authCheck } from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/roleGuard.js";

const router = Router();

router.use(authCheck, roleGuard("driver"));

// GET /earnings/summary?period=today|week|month
router.get("/summary", getEarningsSummary);

// GET /earnings/trips?page=1&limit=20
router.get("/trips", getEarningsTrips);

export default router;
