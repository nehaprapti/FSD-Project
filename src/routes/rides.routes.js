import { Router } from "express";
import {
  estimateRide,
  bookRideController,
  getRide,
  updateRideStatus,
  cancelRideById
} from "../controllers/rides.controller.js";
import { authCheck } from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/roleGuard.js";
import { validateRequired } from "../middlewares/validateRequest.js";

const router = Router();

router.post("/estimate", validateRequired(["pickup", "drop", "rideType"]), estimateRide);
router.use(authCheck);
router.post("/book", roleGuard("passenger"), validateRequired(["pickup", "drop", "rideType"]), bookRideController);
router.get("/:rideId", getRide);
router.patch("/:rideId/status", roleGuard("driver"), validateRequired(["status"]), updateRideStatus);
router.post("/:rideId/cancel", roleGuard("passenger", "driver"), cancelRideById);

export default router;
