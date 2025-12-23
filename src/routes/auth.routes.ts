import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AdminLoginSchema } from "../db/models/admin.model";
import { StudentLoginSchema } from "../db/models/student.model";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";

/**
 * Auth Routes - Handles authentication endpoints
 * Public routes for login, protected routes for user info
 */
const router = Router();
const controller = new AuthController();

// ========== Public Routes (No Authentication Required) ==========

/**
 * POST /login/admin
 * Admin login endpoint
 * Returns JWT token and admin user data
 */
router.post("/login/admin", validate(AdminLoginSchema), controller.loginAdmin);

/**
 * POST /login/student
 * Student login endpoint
 * Returns JWT token and student user data
 */
router.post(
	"/login/student",
	validate(StudentLoginSchema),
	controller.loginStudent,
);

// ========== Protected Routes (Authentication Required) ==========

/**
 * GET /me
 * Get current authenticated user's information
 * Requires valid JWT token
 */
router.get("/me", authenticate, controller.getMe);

export default router;
