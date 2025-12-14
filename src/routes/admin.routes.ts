import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { validate } from '../middleware/validation.middleware';
import { AdminCreateSchema, AdminUpdateSchema } from '../models/admin.model';
import { authenticate } from '../middleware/auth.middleware';
import { checkPermission, isAdmin } from '../middleware/permission.middleware';

/**
 * Admin Routes - Defines API endpoints for Admin
 * All routes require authentication and admin.* permissions
 */
const router = Router();
const controller = new AdminController();

// Apply authentication to all admin routes
router.use(authenticate);
router.use(isAdmin); // Ensure only admin type users can access

router.post('/', checkPermission('admin.create'), validate(AdminCreateSchema), controller.create);
router.get('/', checkPermission('admin.read'), controller.getAll);
router.get('/:id', checkPermission('admin.read'), controller.getById);
router.put('/:id', checkPermission('admin.update'), validate(AdminUpdateSchema), controller.update);
router.delete('/:id', checkPermission('admin.delete'), controller.delete);

export default router;
