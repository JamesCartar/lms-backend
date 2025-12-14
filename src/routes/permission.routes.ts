import { Router } from 'express';
import { PermissionController } from '../controllers/permission.controller';
import { validate } from '../middleware/validation.middleware';
import { PermissionCreateSchema, PermissionUpdateSchema } from '../models/permission.model';

/**
 * Permission Routes - Defines API endpoints for Permission
 */
const router = Router();
const controller = new PermissionController();

router.post('/', validate(PermissionCreateSchema), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', validate(PermissionUpdateSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;
