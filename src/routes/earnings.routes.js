import { Router } from "express";
import { getMyEarnings, requestPayout } from "../controllers/earnings.controller.js";
import { authCheck } from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/roleGuard.js";
import { validateRequired } from "../middlewares/validateRequest.js";

const router = Router();

router.use(authCheck, roleGuard("driver"));

router.get("/me", getMyEarnings);
router.post("/me/payout", validateRequired(["amount"]), requestPayout);

export default router;
