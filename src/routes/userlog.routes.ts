import { Router } from "express";
import { UserLogController } from "../controllers/userlog.controller";
import { UserLogFilterQuerySchema } from "../filters/userlog.filter";
import { authenticate } from "../middleware/auth.middleware";
import { checkPermission, isAdmin } from "../middleware/permission.middleware";
import { validateQuery } from "../middleware/validation.middleware";

/**
 * UserLog Routes - Defines API endpoints for UserLog management
 * All routes require authentication and admin-level permissions
 * UserLogs track user login activities
 */
const router = Router();
const controller = new UserLogController();

// Apply authentication and admin check to all routes
router.use(authenticate);
router.use(isAdmin);

/**
 * GET /
 * Get all user logs with filtering and pagination
 * Required permission: userlog.read
 */
router.get(
	"/",
	checkPermission("userlog.read"),
	validateQuery(UserLogFilterQuerySchema),
	controller.getAll,
);

/**
 * GET /user/:userId
 * Get user logs for a specific user
 * Required permission: userlog.read
 */
router.get(
	"/user/:userId",
	checkPermission("userlog.read"),
	controller.getByUserId,
);

/**
 * GET /:id
 * Get a specific user log by ID
 * Required permission: userlog.read
 */
router.get("/:id", checkPermission("userlog.read"), controller.getById);

/**
 * DELETE /clear
 * Clear all user logs
 * Required permission: userlog.delete
 * Note: This route must come before /:id to avoid conflicts
 */
router.delete("/clear", checkPermission("userlog.delete"), controller.clearAll);

/**
 * DELETE /clear/user/:userId
 * Clear user logs for a specific user
 * Required permission: userlog.delete
 */
router.delete(
	"/clear/user/:userId",
	checkPermission("userlog.delete"),
	controller.clearByUserId,
);

/**
 * DELETE /:id
 * Delete a specific user log by ID
 * Required permission: userlog.delete
 */
router.delete("/:id", checkPermission("userlog.delete"), controller.deleteById);

export default router;
