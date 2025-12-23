import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AdminLoginSchema } from "../db/models/admin.model";
import { StudentLoginSchema } from "../db/models/student.model";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";

const router = Router();
const controller = new AuthController();

router.post("/login/admin", validate(AdminLoginSchema), controller.loginAdmin);
router.post(
	"/login/student",
	validate(StudentLoginSchema),
	controller.loginStudent,
);
router.get("/me", authenticate, controller.getMe);

export default router;
