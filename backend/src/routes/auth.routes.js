import { Router } from "express";
import {
	signupPassengerController,
	signupDriverController,
	login,
	adminLogin,
	verifyOtpController
} from "../controllers/auth.controller.js";
import { validateRequired } from "../middlewares/validateRequest.js";

const router = Router();

router.post("/signup/passenger", validateRequired(["name", "email", "phone", "password"]), signupPassengerController);
router.post(
	"/signup/driver",
	validateRequired(["name", "email", "phone", "password"]),
	signupDriverController
);
router.post("/login", validateRequired(["email", "password"]), login);
router.post("/admin/login", validateRequired(["email", "password"]), adminLogin);
router.post("/verify-otp", validateRequired(["userId", "otp"]), verifyOtpController);

export default router;
