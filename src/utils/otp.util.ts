import crypto from 'node:crypto';

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
