import { Router } from "express";
import { AuditLogController } from "../controllers/auditlog.controller";
import { AuditLogFilterQuerySchema } from "../filters/auditlog.filter";
import { authenticate } from "../middleware/auth.middleware";
import { checkPermission, isAdmin } from "../middleware/permission.middleware";
import { validateQuery } from "../middleware/validation.middleware";

const router = Router();
const controller = new AuditLogController();

router.use(authenticate, isAdmin);

router.get(
	"/",
	checkPermission("auditlog.read"),
	validateQuery(AuditLogFilterQuerySchema),
	controller.getAll,
);
router.get(
	"/user/:userId",
	checkPermission("auditlog.read"),
	controller.getByUserId,
);
router.get(
	"/resource/:resource",
	checkPermission("auditlog.read"),
	controller.getByResource,
);
router.get("/:id", checkPermission("auditlog.read"), controller.getById);
router.delete(
	"/clear",
	checkPermission("auditlog.delete"),
	controller.clearAll,
);
router.delete(
	"/clear/user/:userId",
	checkPermission("auditlog.delete"),
	controller.clearByUserId,
);
router.delete(
	"/:id",
	checkPermission("auditlog.delete"),
	controller.deleteById,
);

export default router;
