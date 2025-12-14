import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { AdminLoginSchema } from "../models/admin.model";
import { StudentLoginSchema } from "../models/student.model";

/**
 * Auth Routes - Handles authentication endpoints
 */
const router = Router();
const controller = new AuthController();

// Public routes (no authentication required)
router.post("/login/admin", validate(AdminLoginSchema), controller.loginAdmin);
router.post(
	"/login/student",
	validate(StudentLoginSchema),
	controller.loginStudent,
);

// Protected route (requires authentication)
router.get("/me", authenticate, controller.getMe);

export default router;
