import { Router } from "express";
import adminRoutes from "./admin.routes";
import auditlogRoutes from "./auditlog.routes";
import authRoutes from "./auth.routes";
import moduleRoutes from "./module.routes";
import permissionRoutes from "./permission.routes";
import roleRoutes from "./role.routes";
import studentRoutes from "./student.routes";
import userlogRoutes from "./userlog.routes";

/**
 * Main Router - Combines all routes
 */
const router = Router();

router.use("/auth", authRoutes);
router.use("/permissions", permissionRoutes);
router.use("/roles", roleRoutes);
router.use("/admins", adminRoutes);
router.use("/modules", moduleRoutes);
router.use("/students", studentRoutes);
router.use("/userlogs", userlogRoutes);
router.use("/auditlogs", auditlogRoutes);

export default router;
