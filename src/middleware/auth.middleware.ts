import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { JwtPayload } from "../types/jwt.types";
import { UnauthorizedError } from "../utils/errors.util";

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

		// Extract token
		const token = authHeader.split(" ")[1];

		if (!token) {
			throw new UnauthorizedError("Invalid token format");
		}

		// Verify token
		const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

		// Attach decoded payload to request
		req.jwt = decoded;

		next();
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			next(new UnauthorizedError("Invalid token"));
		} else if (error instanceof jwt.TokenExpiredError) {
			next(new UnauthorizedError("Token expired"));
		} else {
			next(error);
		}
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

		const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
		req.jwt = decoded;

		next();
	} catch (_error) {
		// Silently continue without authentication
		next();
	}
};
