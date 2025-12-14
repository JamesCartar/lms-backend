import { Router } from 'express';
import { PermissionController } from '../controllers/permission.controller';
import { validate } from '../middleware/validation.middleware';
import { PermissionCreateSchema, PermissionUpdateSchema } from '../models/permission.model';
import { authenticate } from '../middleware/auth.middleware';
import { checkPermission, isAdmin } from '../middleware/permission.middleware';
import { saveHistory } from '../middleware/history.middleware';

/**
 * Permission Routes - Defines API endpoints for Permission
 * All routes require authentication and permission.* permissions
 */
const router = Router();
const controller = new PermissionController();

// Apply authentication to all permission routes
router.use(authenticate);
router.use(isAdmin); // Ensure only admin type users can access

router.post('/', checkPermission('permission.create'), validate(PermissionCreateSchema), saveHistory('permission'), controller.create);
router.get('/', checkPermission('permission.read'), controller.getAll);
router.get('/:id', checkPermission('permission.read'), controller.getById);
router.put('/:id', checkPermission('permission.update'), validate(PermissionUpdateSchema), saveHistory('permission'), controller.update);
router.delete('/:id', checkPermission('permission.delete'), saveHistory('permission'), controller.delete);

export default router;
