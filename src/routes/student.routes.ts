import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { validate } from '../middleware/validation.middleware';
import { StudentCreateSchema, StudentUpdateSchema } from '../models/student.model';

/**
 * Student Routes - Defines API endpoints for Student
 */
const router = Router();
const controller = new StudentController();

router.post('/', validate(StudentCreateSchema), controller.create);
router.get('/', controller.getAll);
router.get('/year/:year', controller.getByEnrollmentYear);
router.get('/:id', controller.getById);
router.put('/:id', validate(StudentUpdateSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;
