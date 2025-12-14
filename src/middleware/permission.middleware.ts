import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.util';

/**
 * Permission Check Middleware
 * Verifies that the authenticated user has the required permissions
 */
export const checkPermission = (...requiredPermissions: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      // Check if user is authenticated
      if (!req.jwt) {
        throw new UnauthorizedError('Authentication required');
      }

      // Get user permissions from JWT
      const userPermissions = req.jwt.permissions || [];

      // Check if user has at least one of the required permissions
      const hasPermission = requiredPermissions.some((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        throw new ForbiddenError(
          `Access denied. Required permissions: ${requiredPermissions.join(' or ')}`
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
      if (!req.jwt) {
        throw new UnauthorizedError('Authentication required');
      }

      const userPermissions = req.jwt.permissions || [];

      const hasAllPermissions = requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        throw new ForbiddenError(
          `Access denied. Required permissions: ${requiredPermissions.join(', ')}`
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
      if (!req.jwt) {
        throw new UnauthorizedError('Authentication required');
      }

      const userRole = req.jwt.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        throw new ForbiddenError(
          `Access denied. Required roles: ${allowedRoles.join(' or ')}`
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
    if (!req.jwt) {
      throw new UnauthorizedError('Authentication required');
    }

    if (req.jwt.type !== 'admin') {
      throw new ForbiddenError('Access denied. Admin access required.');
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
    if (!req.jwt) {
      throw new UnauthorizedError('Authentication required');
    }

    if (req.jwt.type !== 'student') {
      throw new ForbiddenError('Access denied. Student access required.');
    }

    next();
  } catch (error) {
    next(error);
  }
};
