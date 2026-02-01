import type { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils/errors.util";

/**
 * Helper: ensure JWT exists and is an ACCESS token
 */
function requireAccessJwt(req: Request) {
	if (!req.jwt || req.jwt.purpose !== "access") {
		throw new UnauthorizedError("Authentication required");
	}
	return req.jwt; // now typed as access payload (has id/email/permissions/role/etc.)
}

/**
 * Permission Check Middleware
 * Verifies that the authenticated user has the required permissions
 */
export const checkPermission = (...requiredPermissions: string[]) => {
	return (req: Request, _res: Response, next: NextFunction): void => {
		try {
			const jwt = requireAccessJwt(req);

			const userPermissions = jwt.permissions || [];
			const hasPermission = requiredPermissions.some((permission) =>
				userPermissions.includes(permission),
			);

			if (!hasPermission) {
				throw new ForbiddenError(
					`Access denied. Required permissions: ${requiredPermissions.join(" or ")}`,
				);
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};

/**
 * Check if user has ALL specified permissions
 */
export const checkAllPermissions = (...requiredPermissions: string[]) => {
	return (req: Request, _res: Response, next: NextFunction): void => {
		try {
			const jwt = requireAccessJwt(req);

			const userPermissions = jwt.permissions || [];
			const hasAllPermissions = requiredPermissions.every((permission) =>
				userPermissions.includes(permission),
			);

			if (!hasAllPermissions) {
				throw new ForbiddenError(
					`Access denied. Required permissions: ${requiredPermissions.join(", ")}`,
				);
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};

/**
 * Check if user has a specific role
 */
export const checkRole = (...allowedRoles: string[]) => {
	return (req: Request, _res: Response, next: NextFunction): void => {
		try {
			const jwt = requireAccessJwt(req);

			const userRole = jwt.role;
			if (!userRole || !allowedRoles.includes(userRole)) {
				throw new ForbiddenError(
					`Access denied. Required roles: ${allowedRoles.join(" or ")}`,
				);
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};

/**
 * Check if user is admin type
 */
export const isAdmin = (req: Request, _res: Response, next: NextFunction): void => {
	try {
		const jwt = requireAccessJwt(req);

		if (jwt.type !== "admin") {
			throw new ForbiddenError("Access denied. Admin access required.");
		}

		next();
	} catch (error) {
		next(error);
	}
};

/**
 * Check if user is student type
 */
export const isStudent = (req: Request, _res: Response, next: NextFunction): void => {
	try {
		const jwt = requireAccessJwt(req);

		if (jwt.type !== "student") {
			throw new ForbiddenError("Access denied. Student access required.");
		}

		next();
	} catch (error) {
		next(error);
	}
};
