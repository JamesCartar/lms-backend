import { Router } from "express";
import { UserLogController } from "../controllers/userlog.controller";
import { UserLogFilterQuerySchema } from "../filters/userlog.filter";
import { authenticate } from "../middleware/auth.middleware";
import { checkPermission, isAdmin } from "../middleware/permission.middleware";
import { validateQuery } from "../middleware/validation.middleware";

const router = Router();
const controller = new UserLogController();

router.use(authenticate, isAdmin);

router.get(
	"/",
	checkPermission("userlog.read"),
	validateQuery(UserLogFilterQuerySchema),
	controller.getAll,
);
router.get(
	"/user/:userId",
	checkPermission("userlog.read"),
	controller.getByUserId,
);
router.get("/:id", checkPermission("userlog.read"), controller.getById);
router.delete("/clear", checkPermission("userlog.delete"), controller.clearAll);
router.delete(
	"/clear/user/:userId",
	checkPermission("userlog.delete"),
	controller.clearByUserId,
);
router.delete("/:id", checkPermission("userlog.delete"), controller.deleteById);

export default router;
