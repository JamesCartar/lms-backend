import { Router } from 'express';
import { UserLogController } from '../controllers/userlog.controller';
import { authenticate } from '../middleware/auth.middleware';
import { checkPermission, isAdmin } from '../middleware/permission.middleware';

/**
 * UserLog Routes - Defines API endpoints for UserLog
 * All routes require authentication and admin permissions
 */
const router = Router();
const controller = new UserLogController();

// Apply authentication to all userlog routes
router.use(authenticate);
router.use(isAdmin); // Ensure only admin type users can access

router.get('/', checkPermission('userlog.read'), controller.getAll);
router.get('/user/:userId', checkPermission('userlog.read'), controller.getByUserId);
router.get('/:id', checkPermission('userlog.read'), controller.getById);
router.delete('/clear', checkPermission('userlog.delete'), controller.clearAll);
router.delete('/clear/user/:userId', checkPermission('userlog.delete'), controller.clearByUserId);
router.delete('/:id', checkPermission('userlog.delete'), controller.deleteById);

export default router;
