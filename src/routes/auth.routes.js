import { Router } from "express";
import {
	signupPassengerController,
	signupDriverController,
	login,
	adminLogin
} from "../controllers/auth.controller.js";
import { validateRequired } from "../middlewares/validateRequest.js";

const router = Router();

router.post("/signup/passenger", validateRequired(["name", "email", "phone", "password"]), signupPassengerController);
router.post(
	"/signup/driver",
	validateRequired(["name", "email", "phone", "password", "vehicleInfo", "licenseInfo"]),
	signupDriverController
);
router.post("/login", validateRequired(["email", "password"]), login);
router.post("/admin/login", validateRequired(["email", "password"]), adminLogin);

export default router;
