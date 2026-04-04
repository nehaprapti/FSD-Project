import { Router } from "express";
import { estimateFare, finalizeFare, setSurge, getSurge } from "../controllers/pricing.controller.js";
import { authCheck } from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/roleGuard.js";
import { validateRequired } from "../middlewares/validateRequest.js";

const router = Router();

router.post("/estimate", validateRequired(["pickup"]), estimateFare);
router.post("/final/:rideId", authCheck, roleGuard("driver", "admin"), finalizeFare);
router.post("/surge", authCheck, roleGuard("admin"), validateRequired(["areaCode", "multiplier"]), setSurge);
router.get("/surge/:areaCode", getSurge);

export default router;
