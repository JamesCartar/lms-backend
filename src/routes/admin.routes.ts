import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import {
	AdminCreateSchema,
	AdminPasswordChangeSchema,
	AdminUpdateSchema,
} from "../db/models/admin.model";
import { AdminFilterQuerySchema } from "../filters/admin.filter";
import { authenticate } from "../middleware/auth.middleware";
import { saveHistory } from "../middleware/history.middleware";
import { checkPermission, isAdmin } from "../middleware/permission.middleware";
import { validate, validateQuery } from "../middleware/validation.middleware";

const router = Router();
const controller = new AdminController();

router.use(authenticate, isAdmin);

router.post(
	"/",
	checkPermission("admin.create"),
	validate(AdminCreateSchema),
	saveHistory("admin"),
	controller.create,
);
router.get(
	"/",
	checkPermission("admin.read"),
	validateQuery(AdminFilterQuerySchema),
	controller.getAll,
);
router.get("/:id", checkPermission("admin.read"), controller.getById);
router.put(
	"/:id",
	checkPermission("admin.update"),
	validate(AdminUpdateSchema),
	saveHistory("admin"),
	controller.update,
);
router.delete(
	"/:id",
	checkPermission("admin.delete"),
	saveHistory("admin"),
	controller.delete,
);
router.put(
	"/change-password",
	validate(AdminPasswordChangeSchema),
	controller.changePassword,
);

export default router;
