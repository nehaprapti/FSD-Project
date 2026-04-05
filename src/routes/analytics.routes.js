import { Router } from "express";
import {
	getRideStats,
	getRevenueStats,
	aggregateZones,
	getHeatmap,
	getHistory,
	exportAnalytics
} from "../controllers/analytics.controller.js";
import { authCheck } from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/roleGuard.js";

const router = Router();

router.use(authCheck, roleGuard("admin"));

router.get("/rides", getRideStats);
router.get("/revenue", getRevenueStats);
// Cron/trigger endpoint to aggregate recent rides into demand zones
router.post("/aggregate", aggregateZones);
// Heatmap for current hour (admin)
router.get("/heatmap", getHeatmap);
// Historical demand for a zone
router.get("/history", getHistory);
// Export ML-ready dataset
router.get("/export", exportAnalytics);

export default router;
