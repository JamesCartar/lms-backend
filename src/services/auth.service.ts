import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AdminRepository } from '../repositories/admin.repository';
import { StudentRepository } from '../repositories/student.repository';
import { UserLogService } from './userlog.service';
import type { JwtPayload } from '../types/jwt.types';
import {
	hasPermissionDocuments,
	type PopulatedRole,
} from '../types/populated.types';
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from '../utils/errors.util';
import { OtpRepository } from '../repositories/otp.repository';
import { generateOtp } from '../utils/otp.util';
import { OtpTargetType } from '../db/models/otp.model';
import { hashedPassword } from '../utils/password.util';

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

		if (role && typeof role === 'object') {
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
		userType: 'admin' | 'student';
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
				console.error('Failed to create user log:', error);
			});
	}

	async loginAdmin(email: string, password: string, context: LoginContext) {
		const admin =
			await this.adminRepository.findByEmailWithPermissions(email);
		if (!admin) {
			throw new UnauthorizedError('Invalid email or password');
		}

		if (!admin.isActive) {
			throw new UnauthorizedError('Account is inactive');
		}

		const isPasswordValid = await bcrypt.compare(password, admin.password);
		if (!isPasswordValid) {
			throw new UnauthorizedError('Invalid email or password');
		}

		const { roleName, permissions } = this.extractRoleData(admin.role);
		const token = jwt.sign(
			{
				id: admin._id.toString(),
				email: admin.email,
				role: roleName,
				permissions,
				type: 'admin',
			} satisfies JwtPayload,
			env.JWT_SECRET,
			{ expiresIn: '24h' }
		);

		this.logLogin({
			userId: admin._id.toString(),
			userType: 'admin',
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
				type: 'admin' as const,
			},
		};
	}

	async loginStudent(email: string, password: string, context: LoginContext) {
		const student = await this.studentRepository.findByEmail(email);
		if (!student) {
			throw new UnauthorizedError('Invalid email or password');
		}

		if (!student.isActive) {
			throw new UnauthorizedError('Account is inactive');
		}

		const isPasswordValid = await bcrypt.compare(
			password,
			student.password
		);
		if (!isPasswordValid) {
			throw new UnauthorizedError('Invalid email or password');
		}

		const token = jwt.sign(
			{
				id: student._id.toString(),
				email: student.email,
				role: undefined,
				permissions: [],
				type: 'student',
			} satisfies JwtPayload,
			env.JWT_SECRET,
			{ expiresIn: '24h' }
		);

		this.logLogin({
			userId: student._id.toString(),
			userType: 'student',
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
				type: 'student' as const,
			},
		};
	}

	async getCurrentUser(jwtPayload: JwtPayload) {
		if (jwtPayload.type === 'admin') {
			const admin = await this.adminRepository.findByIdWithPermissions(
				jwtPayload.id
			);

			if (!admin) {
				throw new UnauthorizedError('User not found');
			}

			return admin;
		}

		const student = await this.studentRepository.findByIdWithoutPassword(
			jwtPayload.id
		);

		if (!student) {
			throw new UnauthorizedError('User not found');
		}

		return student;
	}

	// * Admin ရှိမရှိ စစ် , Otp ရှိမရှိ စစ် , နောက်မှ create လုပ်
	async sendForgotPasswordOtp(email: string) {
		const checkAdminExist = await this.adminRepository.findByEmail(email);

		if (!checkAdminExist) throw new NotFoundError('Admin Email not found.');

		const checkOtpExist = await this.otpRepository.findByEmail(email);

		if (checkOtpExist) throw new BadRequestError('Otp already exist');

		const generatedOtp = generateOtp(6);

		await this.otpRepository.create({
			otp: generatedOtp,
			email,
			type: OtpTargetType.ADMIN,
		});

		return generatedOtp;
	}

	async verifyForgotPasswordOtp(email: string, otp: string) {
		const checkOtpExist = await this.otpRepository.findByEmail(email);

		if (!checkOtpExist) throw new NotFoundError('OTP not found.');

		if (checkOtpExist?.verified)
			throw new BadRequestError('Otp already verified.');

		const result = await this.otpRepository.update(email, otp, {
			verified: true,
		});

		if (!result) throw new NotFoundError('OTP not found.');

		return result;
	}

	async resetPasswordWithOtp(email: string, rawPassword: string) {
		const checkAdminExist = await this.adminRepository.findByEmail(email);

		if (!checkAdminExist) throw new NotFoundError('Admin not found.');

		const hashPassword = await hashedPassword(rawPassword);

		await this.adminRepository.update(checkAdminExist._id.toString(), {
			password: hashPassword,
		});
	}
}
