import { Router } from "express";
import {
  estimateRide,
  bookRideController,
  getRide,
  updateRideStatus,
  cancelRideById,
  getSharedGroup,
  getUserRidesController
} from "../controllers/rides.controller.js";
import { authCheck } from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/roleGuard.js";
import { validateRequired } from "../middlewares/validateRequest.js";

const router = Router();

router.post("/estimate", validateRequired(["pickup", "drop", "rideType"]), estimateRide);
router.use(authCheck);
router.post("/book", roleGuard("passenger"), validateRequired(["pickup", "drop", "rideType"]), bookRideController);
router.get("/shared/:groupId", getSharedGroup);
router.get("/history", getUserRidesController);
router.get("/:rideId", getRide);

// Aliases and mock endpoints for tests
router.post("/:rideId/status", roleGuard("driver"), validateRequired(["status"]), updateRideStatus);
router.patch("/:rideId/status", roleGuard("driver"), validateRequired(["status"]), updateRideStatus);
router.post("/:rideId/cancel", roleGuard("passenger", "driver"), cancelRideById);
router.post("/:rideId/mock-assign", roleGuard("admin"), async (req, res, next) => {
  try {
    const { rideId } = req.params;
    const { driverId } = req.body;
    // We'll implement this in rides.controller or just here for simplicity
    const { assignDriverToRide } = await import("../services/rides.service.js");
    const ride = await assignDriverToRide(rideId, driverId);
    return res.status(200).json({ success: true, ...ride.toObject ? ride.toObject() : ride });
  } catch (error) {
    next(error);
  }
});
router.post("/:rideId/mock-driver-action", roleGuard("driver"), updateRideStatus);

export default router;
