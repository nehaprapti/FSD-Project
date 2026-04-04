import { Router } from "express";
import { getPassengers, getPassenger, getMyRideHistory } from "../controllers/passengers.controller.js";
import { authCheck } from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/roleGuard.js";

const router = Router();

router.use(authCheck);

router.get("/", roleGuard("admin"), getPassengers);
router.get("/me/rides", roleGuard("passenger"), getMyRideHistory);
router.get("/:passengerId", roleGuard("admin"), getPassenger);

export default router;
