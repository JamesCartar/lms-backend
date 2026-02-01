import { z } from "zod";
import { OtpTargetType } from "../../db/models/otp.model";
import {
	createEmailSchema,
	createEnumSchema,
	createOtpSchema,
	createStringSchema,
} from "../../utils/schema.util";

export const ForgotPasswordRequestSchema = z.object({
	email: createEmailSchema(true),
	source: createEnumSchema(OtpTargetType),
});

export const VerifyForgotPasswordOtpSchema = z.object({
	email: createEmailSchema(true),
	otp: createOtpSchema(true, 6),
});

export const ResetPasswordSchema = z.object({
	resetToken: createStringSchema(true, 20, 600),
	newPassword: createStringSchema(true, 6, 100),
});
