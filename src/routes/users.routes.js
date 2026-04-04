import { Router } from "express";
import { getUsers, getMe, updateMe } from "../controllers/users.controller.js";
import { authCheck } from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/roleGuard.js";

const router = Router();

router.use(authCheck);

router.get("/", roleGuard("admin"), getUsers);
router.get("/me", getMe);
router.patch("/me", updateMe);

export default router;
