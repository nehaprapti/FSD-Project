import { Router } from "express";
import { rateRide, getDriverRatings, getRatingsByRide } from "../controllers/ratings.controller.js";
import { authCheck } from "../middlewares/auth.js";
import { validateRequired } from "../middlewares/validateRequest.js";

const router = Router();

router.post("/", authCheck, validateRequired(["rideId", "score"]), rateRide);
router.get("/driver/:driverId", getDriverRatings);
router.get("/ride/:rideId", getRatingsByRide);

export default router;
