import { Router } from "express";
import { getDashboard, suspendUserById, activateUserById } from "../controllers/admin.controller.js";
import {
	getAdminVerificationQueue,
	approveDriverVerificationByAdmin,
	rejectDriverVerificationByAdmin
} from "../controllers/verification.controller.js";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/roleGuard.js";
import { validateRequired } from "../middlewares/validateRequest.js";

const router = Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboard);
router.patch("/users/:userId/suspend", validateRequired(["reason"]), suspendUserById);
router.patch("/users/:userId/activate", activateUserById);
router.get("/verification/queue", getAdminVerificationQueue);
router.patch("/verification/:driverId/approve", approveDriverVerificationByAdmin);
router.patch(
	"/verification/:driverId/reject",
	validateRequired(["documentType", "reason"]),
	rejectDriverVerificationByAdmin
);

export default router;
