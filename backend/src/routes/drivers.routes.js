import { Router } from "express";
import { getDrivers, getDriver, setDriverAvailability, getMyProfile, updateMyProfile } from "../controllers/drivers.controller.js";
import { authCheck } from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/roleGuard.js";

const router = Router();

router.get("/me", authCheck, roleGuard("driver"), getMyProfile);
router.patch("/me/profile", authCheck, roleGuard("driver"), updateMyProfile);
router.patch("/me/availability", authCheck, roleGuard("driver"), setDriverAvailability);

router.get("/", authCheck, getDrivers);
router.get("/:driverId", authCheck, getDriver);

export default router;
