import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AdminLoginSchema } from '../db/models/admin.model';
import { StudentLoginSchema } from '../db/models/student.model';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
	ForgotPasswordRequestSchema,
	ResetPasswordSchema,
	VerifyForgotPasswordOtpSchema,
} from '../schemas/auth/auth.schema';

/**
 * Auth Routes - Handles authentication endpoints
 */
const router = Router();
const controller = new AuthController();

// Public routes (no authentication required)
router.post(
	'/forgot-password',
	validate(ForgotPasswordRequestSchema),
	controller.sendForgotPasswordOtp
);

router.post(
	'/forgot-password/verify-otp',
	validate(VerifyForgotPasswordOtpSchema),
	controller.verifyForgotPasswordOtp
);

router.patch(
	'/forgot-password/reset',
	validate(ResetPasswordSchema),
	controller.resetPasswordWithOtp
);

router.post('/login/admin', validate(AdminLoginSchema), controller.loginAdmin);
router.post(
	'/login/student',
	validate(StudentLoginSchema),
	controller.loginStudent
);

// Protected route (requires authentication)
router.get('/me', authenticate, controller.getMe);

export default router;
