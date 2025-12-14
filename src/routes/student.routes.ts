import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { validate, validateQuery } from '../middleware/validation.middleware';
import { StudentCreateSchema, StudentUpdateSchema } from '../models/student.model';
import { StudentFilterQuerySchema } from '../filters/student.filter';
import { authenticate } from '../middleware/auth.middleware';
import { checkPermission, isAdmin } from '../middleware/permission.middleware';
import { saveHistory } from '../middleware/history.middleware';

/**
 * Student Routes - Defines API endpoints for Student
 * All routes require authentication and student.* permissions
 */
const router = Router();
const controller = new StudentController();

// Apply authentication to all student routes
router.use(authenticate);
router.use(isAdmin); // Ensure only admin type users can access

router.post('/', checkPermission('student.create'), validate(StudentCreateSchema), saveHistory('student'), controller.create);
router.get('/', checkPermission('student.read'), validateQuery(StudentFilterQuerySchema), controller.getAll);
router.get('/year/:year', checkPermission('student.read'), controller.getByEnrollmentYear);
router.get('/:id', checkPermission('student.read'), controller.getById);
router.put('/:id', checkPermission('student.update'), validate(StudentUpdateSchema), saveHistory('student'), controller.update);
router.delete('/:id', checkPermission('student.delete'), saveHistory('student'), controller.delete);

export default router;
