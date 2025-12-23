import { Router } from "express";
import { AuditLogController } from "../controllers/auditlog.controller";
import { AuditLogFilterQuerySchema } from "../filters/auditlog.filter";
import { authenticate } from "../middleware/auth.middleware";
import { checkPermission, isAdmin } from "../middleware/permission.middleware";
import { validateQuery } from "../middleware/validation.middleware";

/**
 * AuditLog Routes - Defines API endpoints for AuditLog management
 * All routes require authentication and admin-level permissions
 * AuditLogs track changes to resources in the system
 */
const router = Router();
const controller = new AuditLogController();

// Apply authentication and admin check to all routes
router.use(authenticate);
router.use(isAdmin);

/**
 * GET /
 * Get all audit logs with filtering and pagination
 * Required permission: auditlog.read
 */
router.get(
	"/",
	checkPermission("auditlog.read"),
	validateQuery(AuditLogFilterQuerySchema),
	controller.getAll,
);

/**
 * GET /user/:userId
 * Get audit logs for a specific user
 * Required permission: auditlog.read
 */
router.get(
	"/user/:userId",
	checkPermission("auditlog.read"),
	controller.getByUserId,
);

/**
 * GET /resource/:resource
 * Get audit logs for a specific resource type
 * Required permission: auditlog.read
 */
router.get(
	"/resource/:resource",
	checkPermission("auditlog.read"),
	controller.getByResource,
);

/**
 * GET /:id
 * Get a specific audit log by ID
 * Required permission: auditlog.read
 */
router.get("/:id", checkPermission("auditlog.read"), controller.getById);

/**
 * DELETE /clear
 * Clear all audit logs
 * Required permission: auditlog.delete
 * Note: This route must come before /:id to avoid conflicts
 */
router.delete(
	"/clear",
	checkPermission("auditlog.delete"),
	controller.clearAll,
);

/**
 * DELETE /clear/user/:userId
 * Clear audit logs for a specific user
 * Required permission: auditlog.delete
 */
router.delete(
	"/clear/user/:userId",
	checkPermission("auditlog.delete"),
	controller.clearByUserId,
);

/**
 * DELETE /:id
 * Delete a specific audit log by ID
 * Required permission: auditlog.delete
 */
router.delete(
	"/:id",
	checkPermission("auditlog.delete"),
	controller.deleteById,
);

export default router;
