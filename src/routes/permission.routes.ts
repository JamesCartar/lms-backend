import { Router } from "express";
import { PermissionController } from "../controllers/permission.controller";
import {
	PermissionCreateSchema,
	PermissionUpdateSchema,
} from "../db/models/permission.model";
import { PermissionFilterQuerySchema } from "../filters/permission.filter";
import { authenticate } from "../middleware/auth.middleware";
import { saveHistory } from "../middleware/history.middleware";
import { checkPermission, isAdmin } from "../middleware/permission.middleware";
import { validate, validateQuery } from "../middleware/validation.middleware";

const router = Router();
const controller = new PermissionController();

router.use(authenticate, isAdmin);

router.post(
	"/",
	checkPermission("permission.create"),
	validate(PermissionCreateSchema),
	saveHistory("permission"),
	controller.create,
);
router.get(
	"/",
	checkPermission("permission.read"),
	validateQuery(PermissionFilterQuerySchema),
	controller.getAll,
);
router.get("/:id", checkPermission("permission.read"), controller.getById);
router.put(
	"/:id",
	checkPermission("permission.update"),
	validate(PermissionUpdateSchema),
	saveHistory("permission"),
	controller.update,
);
router.delete(
	"/:id",
	checkPermission("permission.delete"),
	saveHistory("permission"),
	controller.delete,
);

export default router;
