import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { validate } from '../middleware/validation.middleware';
import { AdminCreateSchema, AdminUpdateSchema } from '../models/admin.model';

/**
 * Admin Routes - Defines API endpoints for Admin
 */
const router = Router();
const controller = new AdminController();

router.post('/', validate(AdminCreateSchema), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', validate(AdminUpdateSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;
