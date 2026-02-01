import { Router } from "express";
import { CourseController } from "../controllers/course.controller";
import { CourseCreateSchema, CourseUpdateSchema } from "../db/models/course.model";
import { CourseFilterQuerySchema } from "../filters/course.filter";
import { authenticate } from "../middleware/auth.middleware";
import { saveHistory } from "../middleware/history.middleware";
import { checkPermission, isAdmin } from "../middleware/permission.middleware";
import { uploadCourseImage } from "../middleware/upload.middleware";
import { validate, validateQuery } from "../middleware/validation.middleware";

/**
 * Course Routes - Defines API endpoints for Course
 * All routes require authentication and course.* permissions
 */
const router = Router();
const controller = new CourseController();

// Apply authentication to all course routes
router.use(authenticate);
router.use(isAdmin); // Ensure only admin type users can access

router.post(
	"/",
	checkPermission("course.create"),
	uploadCourseImage,
	validate(CourseCreateSchema),
	saveHistory("course"),
	controller.create,
);
router.get(
	"/",
	checkPermission("course.read"),
	validateQuery(CourseFilterQuerySchema),
	controller.getAll,
);
router.get("/:id", checkPermission("course.read"), controller.getById);
router.patch(
	"/:id",
	checkPermission("course.update"),
	uploadCourseImage,
	validate(CourseUpdateSchema),
	saveHistory("course"),
	controller.update,
);
router.delete(
	"/:id",
	checkPermission("course.delete"),
	saveHistory("course"),
	controller.delete,
);

export default router;
