import type { NextFunction, Request, Response } from "express";
import { verifyAuthToken } from "../config/betterAuth";
import { UnauthorizedError } from "../utils/errors.util";
import { logError } from "../utils/logger.util";

/**
 * Authentication Middleware
 * Validates JWT token from Authorization header and attaches payload to request
 */
export const authenticate = async (
	req: Request,
	_res: Response,
	next: NextFunction,
	): Promise<void> => {
	try {
		// Get token from Authorization header
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new UnauthorizedError("No token provided. Please authenticate.");
		}

		const token = authHeader.split(" ")[1];

		if (!token) {
			throw new UnauthorizedError("Invalid token format");
		}

		const decoded = await verifyAuthToken(token);
		if (!decoded) {
			throw new UnauthorizedError("Invalid token");
		}

		// Attach decoded payload to request
		req.jwt = decoded;

		next();
	} catch (error) {
		if (!(error instanceof UnauthorizedError)) {
			logError("Authentication error", error);
		}

		next(
			error instanceof UnauthorizedError
				? error
				: new UnauthorizedError("Invalid token"),
		);
	}
};

/**
 * Optional authentication - doesn't throw error if no token
 * Useful for endpoints that work with or without authentication
 */
export const optionalAuthenticate = async (
	req: Request,
	_res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return next();
		}

		const token = authHeader.split(" ")[1];

		if (!token) {
			return next();
		}

		const decoded = await verifyAuthToken(token);
		if (decoded) {
			req.jwt = decoded;
		}

		next();
	} catch (_error) {
		// Silently continue without authentication
		next();
	}
};
