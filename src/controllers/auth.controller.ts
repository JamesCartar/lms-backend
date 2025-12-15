import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../middleware/error.middleware";
import { AdminModel } from "../models/admin.model";
import { StudentModel } from "../models/student.model";
import { UserLogService } from "../services/userlog.service";
import {
	hasPermissionDocuments,
	type PopulatedRole,
} from "../types/populated.types";
import { UnauthorizedError } from "../utils/errors.util";
import { sendSuccessResponse } from "../utils/response.util";

/**
 * Auth Controller - Handles authentication and login
 */
export class AuthController {
	private userLogService: UserLogService;

	constructor() {
		this.userLogService = new UserLogService();
	}

	/**
	 * Admin login
	 */
	loginAdmin = asyncHandler(async (req: Request, res: Response) => {
		// AdminLoginSchema validation ensures email and password are present
		const { email, password } = req.body;

		// Find admin by email
		const admin = await AdminModel.findOne({ email }).populate({
			path: "role",
			select: "name description type permissions",
			populate: {
				path: "permissions",
				select: "name resource action description",
			},
		});

		if (!admin) {
			throw new UnauthorizedError("Invalid email or password");
		}

		// Check if admin is active
		if (!admin.isActive) {
			throw new UnauthorizedError("Account is inactive");
		}

		// Compare password
		const isPasswordValid = await bcrypt.compare(password, admin.password);
		if (!isPasswordValid) {
			throw new UnauthorizedError("Invalid email or password");
		}

		// Get permissions from role
		const permissions: string[] = [];
		if (admin.role && typeof admin.role === "object") {
			const role = admin.role as PopulatedRole;
			if (role.permissions && hasPermissionDocuments(role.permissions)) {
				role.permissions.forEach((perm) => {
					if (perm.name) {
						permissions.push(perm.name);
					}
				});
			}
		}

		// Generate JWT token
		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			throw new Error("JWT_SECRET is not configured");
		}

		const token = jwt.sign(
			{
				id: admin._id.toString(),
				email: admin.email,
				role:
					admin.role && typeof admin.role === "object"
						? (admin.role as PopulatedRole).name
						: undefined,
				permissions,
				type: "admin",
			},
			jwtSecret,
			{ expiresIn: "24h" },
		);

		// Log the login
		this.userLogService
			.createUserLog({
				userId: admin._id.toString(),
				userType: "admin",
				email: admin.email,
				ip: req.ip || req.socket.remoteAddress,
				userAgent: req.get("user-agent"),
			})
			.catch((error) => {
				// Don't fail login if logging fails
				console.error("Failed to create user log:", error);
			});

		sendSuccessResponse(res, {
			data: {
				token,
				user: {
					id: admin._id,
					name: admin.name,
					email: admin.email,
					role: admin.role,
					type: "admin",
				},
			},
			message: "Login successful",
		});
	});

	/**
	 * Student login
	 */
	loginStudent = asyncHandler(async (req: Request, res: Response) => {
		// StudentLoginSchema validation ensures email and password are present
		const { email, password } = req.body;

		// Find student by email
		const student = await StudentModel.findOne({ email });

		if (!student) {
			throw new UnauthorizedError("Invalid email or password");
		}

		// Check if student is active
		if (!student.isActive) {
			throw new UnauthorizedError("Account is inactive");
		}

		// Compare password
		const isPasswordValid = await bcrypt.compare(password, student.password);
		if (!isPasswordValid) {
			throw new UnauthorizedError("Invalid email or password");
		}

		// Generate JWT token
		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			throw new Error("JWT_SECRET is not configured");
		}

		const token = jwt.sign(
			{
				id: student._id.toString(),
				email: student.email,
				permissions: [],
				type: "student",
			},
			jwtSecret,
			{ expiresIn: "24h" },
		);

		// Log the login
		this.userLogService
			.createUserLog({
				userId: student._id.toString(),
				userType: "student",
				email: student.email,
				ip: req.ip || req.socket.remoteAddress,
				userAgent: req.get("user-agent"),
			})
			.catch((error) => {
				// Don't fail login if logging fails
				console.error("Failed to create user log:", error);
			});

		sendSuccessResponse(res, {
			data: {
				token,
				user: {
					id: student._id,
					firstName: student.firstName,
					lastName: student.lastName,
					email: student.email,
					type: "student",
				},
			},
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

		const { id, type } = req.jwt;

		let user:
			| Awaited<ReturnType<typeof AdminModel.findById>>
			| Awaited<ReturnType<typeof StudentModel.findById>>
			| null;
		if (type === "admin") {
			user = await AdminModel.findById(id)
				.select("-password")
				.populate({
					path: "role",
					select: "name description type permissions",
					populate: {
						path: "permissions",
						select: "name resource action description",
					},
				});
		} else {
			user = await StudentModel.findById(id).select("-password");
		}

		if (!user) {
			throw new UnauthorizedError("User not found");
		}

		sendSuccessResponse(res, { data: { user, jwt: req.jwt } });
	});
}
