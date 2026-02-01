import crypto from 'node:crypto';
import path from 'node:path';
import * as nodemailer from 'nodemailer';
import * as pug from 'pug';
import { env } from '../config/env';

/**
 * Generate a numeric OTP
 */
export const generateOtp = (length: number = 6): string => {
	const max = 10 ** length;
	return crypto.randomInt(0, max).toString().padStart(length, "0");
};

export const sendOtpEmail = async (email: string, otp: string) => {
	try {
		// ✅ Use cwd so it works in production builds
		const templatePath = path.join(
			process.cwd(),
			"templates",
			"otp-email.pug",
		);

		const compiledFunction = pug.compileFile(templatePath);
		const html = compiledFunction({ otp });

		const port = Number(env.SMTP_PORT);

		const transporter = nodemailer.createTransport({
			host: env.SMTP_HOST,
			port,
			secure: port === 465, // correct behavior
			auth: {
				user: env.SMTP_EMAIL_AUTH_USER,
				pass: env.SMTP_EMAIL_PASSWORD,
			},
		});

		// ✅ Optional but VERY useful: verify SMTP connection
		await transporter.verify();

		// ✅ Await sendMail so errors are caught
		const info = await transporter.sendMail({
			from: `"${env.SMTP_FROM}" <${env.SMTP_EMAIL_AUTH_USER}>`,
			to: email,
			subject: "Your One-Time Verification Code",
			html,
		});

		console.log({ info });

		// Nodemailer returns accepted/rejected info
		if (info.accepted && info.accepted.length > 0) {
			return {
				success: true,
				messageId: info.messageId,
				accepted: info.accepted,
			};
		}

		// Rare, but possible
		return {
			success: false,
			error: "Email was not accepted by the SMTP server",
			rejected: info.rejected,
		};
	} catch (error) {
		console.error("Failed to send OTP email:", error);

		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Unknown email sending error",
		};
	}
};