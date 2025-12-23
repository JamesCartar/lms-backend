import { Router } from "express";
import { StudentController } from "../controllers/student.controller";
import {
	StudentCreateSchema,
	StudentUpdateSchema,
} from "../db/models/student.model";
import { StudentFilterQuerySchema } from "../filters/student.filter";
import { authenticate } from "../middleware/auth.middleware";
import { saveHistory } from "../middleware/history.middleware";
import { checkPermission, isAdmin } from "../middleware/permission.middleware";
import { validate, validateQuery } from "../middleware/validation.middleware";

/**
 * Student Routes - Defines API endpoints for Student management
 * All routes require authentication and admin-level permissions
 */
const router = Router();
const controller = new StudentController();

// Apply authentication and admin check to all routes
router.use(authenticate);
router.use(isAdmin);

/**
 * POST /
 * Create a new student
 * Required permission: student.create
 */
router.post(
	"/",
	checkPermission("student.create"),
	validate(StudentCreateSchema),
	saveHistory("student"),
	controller.create,
);

/**
 * GET /
 * Get all students with filtering and pagination
 * Required permission: student.read
 */
router.get(
	"/",
	checkPermission("student.read"),
	validateQuery(StudentFilterQuerySchema),
	controller.getAll,
);

/**
 * GET /year/:year
 * Get students by enrollment year
 * Required permission: student.read
 */
router.get(
	"/year/:year",
	checkPermission("student.read"),
	controller.getByEnrollmentYear,
);

/**
 * GET /:id
 * Get a specific student by ID
 * Required permission: student.read
 */
router.get("/:id", checkPermission("student.read"), controller.getById);

/**
 * PUT /:id
 * Update a student by ID
 * Required permission: student.update
 */
router.put(
	"/:id",
	checkPermission("student.update"),
	validate(StudentUpdateSchema),
	saveHistory("student"),
	controller.update,
);

/**
 * DELETE /:id
 * Delete a student by ID
 * Required permission: student.delete
 */
router.delete(
	"/:id",
	checkPermission("student.delete"),
	saveHistory("student"),
	controller.delete,
);

export default router;
