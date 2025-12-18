import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { AdminFilterQuerySchema } from "../filters/admin.filter";
import { authenticate } from "../middleware/auth.middleware";
import { saveHistory } from "../middleware/history.middleware";
import { checkPermission, isAdmin } from "../middleware/permission.middleware";
import { validate, validateQuery } from "../middleware/validation.middleware";
import { AdminCreateSchema, AdminUpdateSchema } from "../models/admin.model";

/**
 * Admin Routes - Defines API endpoints for Admin
 * All routes require authentication and admin.* permissions
 */
export const createAdminRouter = (
	controller: AdminController = new AdminController(),
) => {
	const router = Router();

	// Apply authentication to all admin routes
	router.use(authenticate);
	router.use(isAdmin); // Ensure only admin type users can access

	router.post(
		"/",
		checkPermission("admin.create"),
		validate(AdminCreateSchema),
		saveHistory("admin"),
		controller.create,
	);
	router.get(
		"/",
		checkPermission("admin.read"),
		validateQuery(AdminFilterQuerySchema),
		controller.getAll,
	);
	router.get("/:id", checkPermission("admin.read"), controller.getById);
	router.put(
		"/:id",
		checkPermission("admin.update"),
		validate(AdminUpdateSchema),
		saveHistory("admin"),
		controller.update,
	);
	router.delete(
		"/:id",
		checkPermission("admin.delete"),
		saveHistory("admin"),
		controller.delete,
	);

	return router;
};
