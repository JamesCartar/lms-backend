import type { DocumentType } from "@typegoose/typegoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Admin } from "../db/models/admin.model";
import { OtpTargetType } from "../db/models/otp.model";
import type { Student } from "../db/models/student.model";
import { AdminRepository } from "../repositories/admin.repository";
import { OtpRepository } from "../repositories/otp.repository";
import { StudentRepository } from "../repositories/student.repository";
import type { JwtPayload } from "../types/jwt.types";
import {
	hasPermissionDocuments,
	type PopulatedRole,
} from "../types/populated.types";
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from "../utils/errors.util";
import { signJwt, verifyJwt } from "../utils/jwt.util";
import { generateOtp, sendOtpEmail } from "../utils/otp.util";
import { hashedPassword } from "../utils/password.util";
import { UserLogService } from "./userlog.service";

type LoginContext = {
	ip?: string;
	userAgent?: string;
};

/**
 * Auth Service - Business logic for authentication
 */
export class AuthService {
	private adminRepository: AdminRepository;
	private studentRepository: StudentRepository;
	private userLogService: UserLogService;
	private otpRepository: OtpRepository;

	constructor() {
		this.adminRepository = new AdminRepository();
		this.studentRepository = new StudentRepository();
		this.userLogService = new UserLogService();
		this.otpRepository = new OtpRepository();
	}

	private extractRoleData(role: unknown) {
		const permissions: string[] = [];
		let roleName: string | undefined;

		if (role && typeof role === "object") {
			const typedRole = role as PopulatedRole;
			roleName = typedRole.name;

			if (
				typedRole.permissions &&
				hasPermissionDocuments(typedRole.permissions)
			) {
				typedRole.permissions.forEach((perm) => {
					if (perm.name) {
						permissions.push(perm.name);
					}
				});
			}
		}

		return { roleName, permissions };
	}

	private logLogin(data: {
		userId: string;
		userType: "admin" | "student";
		email: string;
		context: LoginContext;
	}) {
		this.userLogService
			.createUserLog({
				userId: data.userId,
				userType: data.userType,
				email: data.email,
				ip: data.context.ip,
				userAgent: data.context.userAgent,
			})
			.catch((error) => {
				// Don't fail login if logging fails
				console.error("Failed to create user log:", error);
			});
	}

	private readonly passwordResetStrategy: Record<
		OtpTargetType,
		{
			findByEmail: (
				email: string,
			) => Promise<DocumentType<Admin> | DocumentType<Student> | null>;
			updatePassword: (
				id: string,
				hashedPassword: string,
			) => Promise<DocumentType<Admin> | DocumentType<Student> | null>;
		}
	> = {
			[OtpTargetType.ADMIN]: {
				findByEmail: (email) => this.adminRepository.findByEmail(email),

				updatePassword: (id, hashedPassword) =>
					this.adminRepository.update(id, {
						password: hashedPassword,
					}),
			},

			[OtpTargetType.STUDENT]: {
				findByEmail: (email) => this.studentRepository.findByEmail(email),

				updatePassword: (id, hashedPassword) =>
					this.studentRepository.update(id, {
						password: hashedPassword,
					}),
			},
		};

	async loginAdmin(email: string, password: string, context: LoginContext) {
		const admin = await this.adminRepository.findByEmailWithPermissions(email);
		if (!admin) {
			throw new UnauthorizedError("Invalid email or password");
		}

		if (!admin.isActive) {
			throw new UnauthorizedError("Account is inactive");
		}

		const isPasswordValid = await bcrypt.compare(password, admin.password);
		if (!isPasswordValid) {
			throw new UnauthorizedError("Invalid email or password");
		}

		const { roleName, permissions } = this.extractRoleData(admin.role);
		const token = signJwt(
			{
				id: admin._id.toString(),
				email: admin.email,
				role: roleName,
				permissions,
				type: "admin",
				purpose: "access",
			},
			{ expiresIn: "24h" },
		);

		this.logLogin({
			userId: admin._id.toString(),
			userType: "admin",
			email: admin.email,
			context,
		});

		return {
			token,
			user: {
				id: admin._id,
				name: admin.name,
				email: admin.email,
				role: admin.role,
				type: "admin" as const,
			},
		};
	}

	async loginStudent(email: string, password: string, context: LoginContext) {
		const student = await this.studentRepository.findByEmail(email);
		if (!student) {
			throw new UnauthorizedError("Invalid email or password");
		}

		if (!student.isActive) {
			throw new UnauthorizedError("Account is inactive");
		}

		const isPasswordValid = await bcrypt.compare(password, student.password);
		if (!isPasswordValid) {
			throw new UnauthorizedError("Invalid email or password");
		}


		const token = signJwt(
			{
				id: student._id.toString(),
				email: student.email,
				role: undefined,
				permissions: [],
				type: "student",
				purpose: "access",
			},
			{ expiresIn: "24h" },
		);

		this.logLogin({
			userId: student._id.toString(),
			userType: "student",
			email: student.email,
			context,
		});

		return {
			token,
			user: {
				id: student._id,
				firstName: student.firstName,
				lastName: student.lastName,
				email: student.email,
				type: "student" as const,
			},
		};
	}

	async getCurrentUser(jwtPayload: JwtPayload) {

		if (jwtPayload.purpose !== "access") {
			throw new UnauthorizedError("Invalid token");
		}

		if (jwtPayload.type === "admin") {
			const admin = await this.adminRepository.findByIdWithPermissions(jwtPayload.id);
			if (!admin) throw new UnauthorizedError("User not found");
			return admin;
		}

		const student = await this.studentRepository.findByIdWithoutPassword(jwtPayload.id);
		if (!student) throw new UnauthorizedError("User not found");
		return student;
	}

	// * Admin ရှိမရှိ စစ် , Otp ရှိမရှိ စစ် , နောက်မှ create လုပ်
	async sendForgotPasswordOtp(email: string, source: OtpTargetType) {
		console.log({ email, source });
		let identity: Admin | Student | null;
		switch (source) {
			case OtpTargetType.ADMIN:
				identity = await this.adminRepository.findByEmail(email);
				console.log({ identity });

				break;

			default:
				identity = await this.studentRepository.findByEmail(email);
				console.log({ identity });
				break;
		}

		if (!identity) throw new NotFoundError("Email not found.");

		const checkOtpExist = await this.otpRepository.findByEmail(email, source);

		if (checkOtpExist) throw new BadRequestError("Otp already exist");

		const generatedOtp = generateOtp(6);

		await this.otpRepository.create({
			otp: generatedOtp,
			email,
			type: source,
		});

		await sendOtpEmail(email, generatedOtp);

		return generatedOtp;
	}

	async verifyForgotPasswordOtp({
		email,
		otp,
		source,
	}: {
		email: string;
		otp: string;
		source: OtpTargetType;
	}) {
		const checkOtpExist = await this.otpRepository.findByEmail(email, source);

		if (!checkOtpExist) throw new NotFoundError("OTP not found.");

		if (checkOtpExist?.verified)
			throw new BadRequestError("Otp already verified.");

		const result = await this.otpRepository.update({
			email,
			otp,
			source,
			data: {
				verified: true,
			},
		});


		if (!result) throw new NotFoundError("OTP not found.");

		const resetToken = signJwt({
			purpose: "password_reset",
			email,
			type: source,
		}, {
			expiresIn: "5m"
		})

		return resetToken;
	}

	async resetPasswordWithOtp({
		resetToken,
		newPassword,

	}: {
		resetToken: string;
		newPassword: string;
	}) {
		let payload: JwtPayload;

		try {
			payload = verifyJwt(resetToken); // your util uses jwt.verify internally
		} catch (err) {
			if (err instanceof jwt.TokenExpiredError) {
				throw new UnauthorizedError("Reset token expired. Please request a new OTP.");
			}
			throw new UnauthorizedError("Invalid reset token.");
		}

		if (payload.purpose !== "password_reset") {
			throw new UnauthorizedError("Invalid reset token.");
		}

		const email = payload.email.toLowerCase();

		const source = payload.type as OtpTargetType;

		const otpDoc = await this.otpRepository.findByVerifiedEmail(email, source);
		if (!otpDoc) throw new NotFoundError("OTP not found.");
		if (!otpDoc.verified) throw new BadRequestError("OTP not verified.");


		const strategy = this.passwordResetStrategy[source];

		const identity = await strategy.findByEmail(email);
		if (!identity) {
			throw new NotFoundError("User not found.");
		}

		const hashed = await hashedPassword(newPassword);

		await strategy.updatePassword(identity._id.toString(), hashed);
	}
}
