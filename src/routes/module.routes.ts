import { Router } from "express";
import { ModuleController } from "../controllers/module.controller";
import { ModuleCreateSchema, ModuleUpdateSchema } from "../db/models/module.model";
import { authenticate } from "../middleware/auth.middleware";
import { saveHistory } from "../middleware/history.middleware";
import { isAdmin } from "../middleware/permission.middleware";
import { validate } from "../middleware/validation.middleware";

/**
 * Admin Routes - Defines API endpoints for Admin
 * All routes require authentication and admin.* permissions
 */
const router = Router();
const controller = new ModuleController();

// Apply authentication to all admin routes
router.use(authenticate);
router.use(isAdmin); // Ensure only admin type users can access

router.post(
    "/",
    // checkPermission("module.create"),
    validate(ModuleCreateSchema),
    saveHistory("admin"),
    // controller.create,
);
router.get(
    "/",
    // checkPermission("module.read"),
    // validateQuery(AdminFilterQuerySchema),
    controller.getAll,
);
// router.get("/:id", checkPermission("module.read"), controller.getById);
router.put(
    "/:id",
    // checkPermission("module.update"),
    validate(ModuleUpdateSchema),
    saveHistory("admin"),
    // controller.update,
);
router.delete(
    "/:id",
    // checkPermission("module.delete"),
    saveHistory("admin"),
    // controller.delete,
);

export default router;
