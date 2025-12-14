import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { validate } from '../middleware/validation.middleware';
import { StudentCreateSchema, StudentUpdateSchema } from '../models/student.model';
import { authenticate } from '../middleware/auth.middleware';
import { checkPermission, isAdmin } from '../middleware/permission.middleware';

/**
 * Student Routes - Defines API endpoints for Student
 * All routes require authentication and student.* permissions
 */
const router = Router();
const controller = new StudentController();

// Apply authentication to all student routes
router.use(authenticate);
router.use(isAdmin); // Ensure only admin type users can access

router.post('/', checkPermission('student.create'), validate(StudentCreateSchema), controller.create);
router.get('/', checkPermission('student.read'), controller.getAll);
router.get('/year/:year', checkPermission('student.read'), controller.getByEnrollmentYear);
router.get('/:id', checkPermission('student.read'), controller.getById);
router.put('/:id', checkPermission('student.update'), validate(StudentUpdateSchema), controller.update);
router.delete('/:id', checkPermission('student.delete'), controller.delete);

export default router;
