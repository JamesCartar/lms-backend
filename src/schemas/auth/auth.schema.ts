import { z } from 'zod';
import {
	createEmailSchema,
	createOtpSchema,
	createStringSchema,
} from '../../utils/schema.util';

export const ForgotPasswordRequestSchema = z.object({
	email: createEmailSchema(true),
});

export const VerifyForgotPasswordOtpSchema = z.object({
	email: createEmailSchema(true),
	otp: createOtpSchema(true, 6),
});

export const ResetPasswordSchema = z.object({
	email: createEmailSchema(true),
	newPassword: createStringSchema(true, 6, 100),
});
