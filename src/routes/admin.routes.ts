import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { validate, validateQuery } from '../middleware/validation.middleware';
import { AdminCreateSchema, AdminUpdateSchema } from '../models/admin.model';
import { AdminFilterQuerySchema } from '../filters/admin.filter';
import { authenticate } from '../middleware/auth.middleware';
import { checkPermission, isAdmin } from '../middleware/permission.middleware';
import { saveHistory } from '../middleware/history.middleware';

/**
 * Admin Routes - Defines API endpoints for Admin
 * All routes require authentication and admin.* permissions
 */
const router = Router();
const controller = new AdminController();

// Apply authentication to all admin routes
router.use(authenticate);
router.use(isAdmin); // Ensure only admin type users can access

router.post('/', checkPermission('admin.create'), validate(AdminCreateSchema), saveHistory('admin'), controller.create);
router.get('/', checkPermission('admin.read'), validateQuery(AdminFilterQuerySchema), controller.getAll);
router.get('/:id', checkPermission('admin.read'), controller.getById);
router.put('/:id', checkPermission('admin.update'), validate(AdminUpdateSchema), saveHistory('admin'), controller.update);
router.delete('/:id', checkPermission('admin.delete'), saveHistory('admin'), controller.delete);

export default router;
