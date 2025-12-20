import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/error.middleware";
import { AuthService } from "../services/auth.service";
import { UnauthorizedError } from "../utils/errors.util";
import { sendSuccessResponse } from "../utils/response.util";

/**
 * Auth Controller - Handles authentication and login
 */
export class AuthController {
	private authService: AuthService;

	constructor() {
		this.authService = new AuthService();
	}

	/**
	 * Admin login
	 */
	loginAdmin = asyncHandler(async (req: Request, res: Response) => {
		// AdminLoginSchema validation ensures email and password are present
		const { email, password } = req.body;

		const result = await this.authService.loginAdmin(email, password, {
			ip: req.ip || req.socket.remoteAddress,
			userAgent: req.get("user-agent"),
		});

		sendSuccessResponse(res, {
			data: result,
			message: "Login successful",
		});
	});

	/**
	 * Student login
	 */
	loginStudent = asyncHandler(async (req: Request, res: Response) => {
		// StudentLoginSchema validation ensures email and password are present
		const { email, password } = req.body;

		const result = await this.authService.loginStudent(email, password, {
			ip: req.ip || req.socket.remoteAddress,
			userAgent: req.get("user-agent"),
		});

		sendSuccessResponse(res, {
			data: result,
			message: "Login successful",
		});
	});

	/**
	 * Get current user info
	 */
	getMe = asyncHandler(async (req: Request, res: Response) => {
		if (!req.jwt) {
			throw new UnauthorizedError("Not authenticated");
		}

		const user = await this.authService.getCurrentUser(req.jwt);

		sendSuccessResponse(res, { data: { user, jwt: req.jwt } });
	});
}
