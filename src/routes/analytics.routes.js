import { Router } from "express";
import { getRideStats, getRevenueStats } from "../controllers/analytics.controller.js";
import { authCheck } from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/roleGuard.js";

const router = Router();

router.use(authCheck, roleGuard("admin"));

router.get("/rides", getRideStats);
router.get("/revenue", getRevenueStats);

export default router;
