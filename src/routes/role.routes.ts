import { Router } from "express";
import { RoleController } from "../controllers/role.controller";
import { RoleCreateSchema, RoleUpdateSchema } from "../db/models/role.model";
import { RoleFilterQuerySchema } from "../filters/role.filter";
import { authenticate } from "../middleware/auth.middleware";
import { saveHistory } from "../middleware/history.middleware";
import { checkPermission, isAdmin } from "../middleware/permission.middleware";
import { validate, validateQuery } from "../middleware/validation.middleware";

const router = Router();
const controller = new RoleController();

router.use(authenticate, isAdmin);

router.post(
	"/",
	checkPermission("role.create"),
	validate(RoleCreateSchema),
	saveHistory("role"),
	controller.create,
);
router.get("/names", checkPermission("role.read"), controller.getRoleNames);
router.get(
	"/",
	checkPermission("role.read"),
	validateQuery(RoleFilterQuerySchema),
	controller.getAll,
);
router.get("/:id", checkPermission("role.read"), controller.getById);
router.put(
	"/:id",
	checkPermission("role.update"),
	validate(RoleUpdateSchema),
	saveHistory("role"),
	controller.update,
);
router.delete(
	"/:id",
	checkPermission("role.delete"),
	saveHistory("role"),
	controller.delete,
);

export default router;
