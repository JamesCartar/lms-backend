import { Router } from "express";
import { PermissionController } from "../controllers/permission.controller";
import {
	PermissionCreateSchema,
	PermissionUpdateSchema,
} from "../db/models/permission.model";
import { PermissionFilterQuerySchema } from "../filters/permission.filter";
import { authenticate } from "../middleware/auth.middleware";
import { saveHistory } from "../middleware/history.middleware";
import { checkPermission, isAdmin } from "../middleware/permission.middleware";
import { validate, validateQuery } from "../middleware/validation.middleware";

/**
 * Permission Routes - Defines API endpoints for Permission management
 * All routes require authentication and admin-level permissions
 */
const router = Router();
const controller = new PermissionController();

// Apply authentication and admin check to all routes
router.use(authenticate);
router.use(isAdmin);

/**
 * POST /
 * Create a new permission
 * Required permission: permission.create
 */
router.post(
	"/",
	checkPermission("permission.create"),
	validate(PermissionCreateSchema),
	saveHistory("permission"),
	controller.create,
);

/**
 * GET /
 * Get all permissions with filtering and pagination
 * Required permission: permission.read
 */
router.get(
	"/",
	checkPermission("permission.read"),
	validateQuery(PermissionFilterQuerySchema),
	controller.getAll,
);

/**
 * GET /:id
 * Get a specific permission by ID
 * Required permission: permission.read
 */
router.get("/:id", checkPermission("permission.read"), controller.getById);

/**
 * PUT /:id
 * Update a permission by ID
 * Required permission: permission.update
 */
router.put(
	"/:id",
	checkPermission("permission.update"),
	validate(PermissionUpdateSchema),
	saveHistory("permission"),
	controller.update,
);

/**
 * DELETE /:id
 * Delete a permission by ID
 * Required permission: permission.delete
 */
router.delete(
	"/:id",
	checkPermission("permission.delete"),
	saveHistory("permission"),
	controller.delete,
);

export default router;
