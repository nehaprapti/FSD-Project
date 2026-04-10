import { Router } from "express";
import {
  uploadVerification,
  getVerificationStatus
} from "../controllers/verification.controller.js";
import { authCheck } from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/roleGuard.js";
import { validateRequired } from "../middlewares/validateRequest.js";

import { upload } from "../middlewares/upload.js";

const router = Router();

router.post("/upload", authCheck, roleGuard("driver"), upload.single("document"), uploadVerification);
router.get("/status", authCheck, roleGuard("driver"), getVerificationStatus);

export default router;
