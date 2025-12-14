import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

/**
 * Auth Routes - Handles authentication endpoints
 */
const router = Router();
const controller = new AuthController();

// Public routes (no authentication required)
router.post('/login/admin', controller.loginAdmin);
router.post('/login/student', controller.loginStudent);

// Protected route (requires authentication)
router.get('/me', authenticate, controller.getMe);

export default router;
