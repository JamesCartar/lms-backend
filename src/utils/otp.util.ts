import crypto from 'node:crypto';
import path from 'node:path';
import * as nodemailer from 'nodemailer';
import * as pug from 'pug';
import { env } from '../config/env';

const SMTP_HOST = env.SMTP_HOST;
const SMTP_PORT = env.SMTP_PORT;
const SMTP_EMAIL_AUTH_USER = env.SMTP_EMAIL_AUTH_USER;
const SMTP_EMAIL_PASSWORD = env.SMTP_EMAIL_PASSWORD;
const SMTP_FROM = env.SMTP_FROM;

/**
 * Generate a numeric OTP
 * * Uses crypto-safe randomness
 * * Returns string to preserve leading zeros
 */

export const generateOtp = (length: number = 6): string => {
	const max = 10 ** length;

	const otp = crypto.randomInt(0, max).toString().padStart(length, '0');

	return otp;
};

export const sendOtpEmail = async (email: string, otp: string) => {
	const templatePath = path.join(
		__dirname,
		'..',
		'..',
		'templates',
		'otp-email.pug',
	);

	console.log({ templatePath });

	const compiledFunction = pug.compileFile(templatePath);
	const html = compiledFunction({ otp });

	const transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: Number(SMTP_PORT),
		secure: true,
		auth: {
			user: SMTP_EMAIL_AUTH_USER,
			pass: SMTP_EMAIL_PASSWORD,
		},
	});

	transporter.sendMail({
		from: SMTP_FROM,
		to: email,
		subject: 'Your One-Time Verification Code',
		html,
	});
};
