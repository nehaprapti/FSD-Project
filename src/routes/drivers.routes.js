import { Router } from "express";
import { getDrivers, getDriver, setDriverAvailability } from "../controllers/drivers.controller.js";
import { authCheck } from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/roleGuard.js";

const router = Router();

router.get("/", authCheck, getDrivers);
router.get("/:driverId", authCheck, getDriver);
router.patch("/me/availability", authCheck, roleGuard("driver"), setDriverAvailability);

export default router;
