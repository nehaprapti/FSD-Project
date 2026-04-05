import { Router } from "express";
import {
	getDashboard,
	suspendUserById,
	activateUserById,
	getUsers,
	adminBlockUser,
	adminUnblockUser,
	getRides,
	getRideDetail,
	getDrivers,
	getComplaints
} from "../controllers/admin.controller.js";
import {
	getAdminVerificationQueue,
	approveDriverVerificationByAdmin,
	rejectDriverVerificationByAdmin
} from "../controllers/verification.controller.js";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/roleGuard.js";
import { validateRequired } from "../middlewares/validateRequest.js";
import { adminGetPendingPayouts, adminMarkPaid } from "../controllers/earnings.controller.js";

const router = Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboard);
router.patch("/users/:userId/suspend", validateRequired(["reason"]), suspendUserById);
router.patch("/users/:userId/activate", activateUserById);
router.get("/verification/queue", getAdminVerificationQueue);
router.patch("/verification/:driverId/approve", approveDriverVerificationByAdmin);
	router.patch(
		"/verification/:driverId/reject",
		validateRequired(["reason"]),
		rejectDriverVerificationByAdmin
	);

// Admin user management
router.get("/users", getUsers);
router.patch("/users/:userId/block", adminBlockUser);
router.patch("/users/:userId/unblock", adminUnblockUser);

// Admin rides
router.get("/rides", getRides);
router.get("/rides/:rideId", getRideDetail);

// Drivers list
router.get("/drivers", getDrivers);

// Complaints (proxy)
router.get("/complaints", getComplaints);

router.get("/earnings/payouts", adminGetPendingPayouts);
router.patch("/earnings/:earningsId/mark-paid", adminMarkPaid);

export default router;
