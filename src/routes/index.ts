import { Router } from 'express';
import permissionRoutes from './permission.routes';
import roleRoutes from './role.routes';
import adminRoutes from './admin.routes';
import studentRoutes from './student.routes';

/**
 * Main Router - Combines all routes
 */
const router = Router();

router.use('/permissions', permissionRoutes);
router.use('/roles', roleRoutes);
router.use('/admins', adminRoutes);
router.use('/students', studentRoutes);

export default router;
