import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import {
	AdminCreateSchema,
	AdminPasswordChangeSchema,
	AdminUpdateSchema,
} from "../db/models/admin.model";
import { AdminFilterQuerySchema } from "../filters/admin.filter";
import { authenticate } from "../middleware/auth.middleware";
import { saveHistory } from "../middleware/history.middleware";
import { checkPermission, isAdmin } from "../middleware/permission.middleware";
import { validate, validateQuery } from "../middleware/validation.middleware";

/**
 * Admin Routes - Defines API endpoints for Admin management
 * All routes require authentication and admin-level permissions
 */
const router = Router();
const controller = new AdminController();

// Apply authentication and admin check to all routes
router.use(authenticate);
router.use(isAdmin);

/**
 * POST /
 * Create a new admin
 * Required permission: admin.create
 */
router.post(
	"/",
	checkPermission("admin.create"),
	validate(AdminCreateSchema),
	saveHistory("admin"),
	controller.create,
);

/**
 * GET /
 * Get all admins with filtering and pagination
 * Required permission: admin.read
 */
router.get(
	"/",
	checkPermission("admin.read"),
	validateQuery(AdminFilterQuerySchema),
	controller.getAll,
);

/**
 * GET /:id
 * Get a specific admin by ID
 * Required permission: admin.read
 */
router.get("/:id", checkPermission("admin.read"), controller.getById);

/**
 * PUT /:id
 * Update an admin by ID
 * Required permission: admin.update
 */
router.put(
	"/:id",
	checkPermission("admin.update"),
	validate(AdminUpdateSchema),
	saveHistory("admin"),
	controller.update,
);

/**
 * DELETE /:id
 * Delete an admin by ID
 * Required permission: admin.delete
 */
router.delete(
	"/:id",
	checkPermission("admin.delete"),
	saveHistory("admin"),
	controller.delete,
);

/**
 * PUT /change-password
 * Change current admin's password
 * Requires oldPassword and newPassword
 */
router.put(
	"/change-password",
	validate(AdminPasswordChangeSchema),
	controller.changePassword,
);

export default router;
