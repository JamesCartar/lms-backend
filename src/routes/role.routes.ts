import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';
import { validate } from '../middleware/validation.middleware';
import { RoleCreateSchema, RoleUpdateSchema } from '../models/role.model';
import { authenticate } from '../middleware/auth.middleware';
import { checkPermission, isAdmin } from '../middleware/permission.middleware';
import { saveHistory } from '../middleware/history.middleware';

/**
 * Role Routes - Defines API endpoints for Role
 * All routes require authentication and role.* permissions
 */
const router = Router();
const controller = new RoleController();

// Apply authentication to all role routes
router.use(authenticate);
router.use(isAdmin); // Ensure only admin type users can access

router.post('/', checkPermission('role.create'), validate(RoleCreateSchema), saveHistory('role'), controller.create);
router.get('/', checkPermission('role.read'), controller.getAll);
router.get('/:id', checkPermission('role.read'), controller.getById);
router.put('/:id', checkPermission('role.update'), validate(RoleUpdateSchema), saveHistory('role'), controller.update);
router.delete('/:id', checkPermission('role.delete'), saveHistory('role'), controller.delete);

export default router;
