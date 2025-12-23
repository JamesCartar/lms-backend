import { Router } from "express";
import { RoleController } from "../controllers/role.controller";
import { RoleCreateSchema, RoleUpdateSchema } from "../db/models/role.model";
import { RoleFilterQuerySchema } from "../filters/role.filter";
import { authenticate } from "../middleware/auth.middleware";
import { saveHistory } from "../middleware/history.middleware";
import { checkPermission, isAdmin } from "../middleware/permission.middleware";
import { validate, validateQuery } from "../middleware/validation.middleware";

/**
 * Role Routes - Defines API endpoints for Role management
 * All routes require authentication and admin-level permissions
 */
const router = Router();
const controller = new RoleController();

// Apply authentication and admin check to all routes
router.use(authenticate);
router.use(isAdmin);

/**
 * POST /
 * Create a new role
 * Required permission: role.create
 */
router.post(
	"/",
	checkPermission("role.create"),
	validate(RoleCreateSchema),
	saveHistory("role"),
	controller.create,
);

/**
 * GET /names
 * Get list of all role names
 * Required permission: role.read
 * Note: This route must come before /:id to avoid conflicts
 */
router.get("/names", checkPermission("role.read"), controller.getRoleNames);

/**
 * GET /
 * Get all roles with filtering and pagination
 * Required permission: role.read
 */
router.get(
	"/",
	checkPermission("role.read"),
	validateQuery(RoleFilterQuerySchema),
	controller.getAll,
);

/**
 * GET /:id
 * Get a specific role by ID
 * Required permission: role.read
 */
router.get("/:id", checkPermission("role.read"), controller.getById);

/**
 * PUT /:id
 * Update a role by ID
 * Required permission: role.update
 */
router.put(
	"/:id",
	checkPermission("role.update"),
	validate(RoleUpdateSchema),
	saveHistory("role"),
	controller.update,
);

/**
 * DELETE /:id
 * Delete a role by ID
 * Required permission: role.delete
 */
router.delete(
	"/:id",
	checkPermission("role.delete"),
	saveHistory("role"),
	controller.delete,
);

export default router;
