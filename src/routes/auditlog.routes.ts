import { Router } from 'express';
import { AuditLogController } from '../controllers/auditlog.controller';
import { authenticate } from '../middleware/auth.middleware';
import { checkPermission, isAdmin } from '../middleware/permission.middleware';

/**
 * AuditLog Routes - Defines API endpoints for AuditLog
 * All routes require authentication and admin permissions
 */
const router = Router();
const controller = new AuditLogController();

// Apply authentication to all auditlog routes
router.use(authenticate);
router.use(isAdmin); // Ensure only admin type users can access

router.get('/', checkPermission('auditlog.read'), controller.getAll);
router.get('/user/:userId', checkPermission('auditlog.read'), controller.getByUserId);
router.get('/resource/:resource', checkPermission('auditlog.read'), controller.getByResource);
router.get('/:id', checkPermission('auditlog.read'), controller.getById);
router.delete('/clear', checkPermission('auditlog.delete'), controller.clearAll);
router.delete('/clear/user/:userId', checkPermission('auditlog.delete'), controller.clearByUserId);
router.delete('/:id', checkPermission('auditlog.delete'), controller.deleteById);

export default router;
