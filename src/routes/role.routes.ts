import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';
import { validate } from '../middleware/validation.middleware';
import { RoleCreateSchema, RoleUpdateSchema } from '../models/role.model';

/**
 * Role Routes - Defines API endpoints for Role
 */
const router = Router();
const controller = new RoleController();

router.post('/', validate(RoleCreateSchema), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', validate(RoleUpdateSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;
