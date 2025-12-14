import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '../utils/errors.util';
import { ValidatedQuery } from '../types/request.types';
import '../types/request.types';

/**
 * Convert Zod error messages to user-friendly messages
 */
const makeErrorMessageUserFriendly = (message: string, path: string): string => {
  // Common patterns and their friendly messages
  if (message.includes('Invalid email')) {
    return 'Please enter a valid email address';
  }
  if (message.includes('Expected string')) {
    return `${path} must be a text value`;
  }
  if (message.includes('Expected number')) {
    return `${path} must be a number`;
  }
  if (message.includes('Expected boolean')) {
    return `${path} must be true or false`;
  }
  if (message.includes('too_small') || message.includes('String must contain at least')) {
    const match = message.match(/at least (\d+)/);
    if (match) {
      return `${path} must be at least ${match[1]} characters long`;
    }
  }
  if (message.includes('too_big') || message.includes('String must contain at most')) {
    const match = message.match(/at most (\d+)/);
    if (match) {
      return `${path} must be at most ${match[1]} characters long`;
    }
  }
  if (message.includes('Invalid datetime')) {
    return `${path} must be a valid date and time (ISO 8601 format)`;
  }
  if (message.includes('Invalid enum value')) {
    const match = message.match(/Expected (.+?),/);
    if (match) {
      return `${path} must be one of: ${match[1]}`;
    }
  }
  if (message.includes('Invalid input') && path.includes('ObjectId')) {
    return `${path} must be a valid ID`;
  }

  // Return the original message if no friendly replacement found
  return message;
};

/**
 * Validation middleware for request body validation using Zod schemas
 */
export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err) => {
          const fieldName = err.path.join('.') || 'field';
          return {
            field: fieldName,
            message: makeErrorMessageUserFriendly(err.message, fieldName),
          };
        });
        next(new ValidationError('Please check the following fields and try again', errors));
      } else {
        next(error);
      }
    }
  };
};

/**
 * Validation middleware for query parameters validation using Zod schemas
 */
export const validateQuery = (schema: z.ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.query);
      // Store validated query in req for later use
      req.validatedQuery = validated as unknown as ValidatedQuery;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err) => {
          const fieldName = err.path.join('.') || 'parameter';
          return {
            field: fieldName,
            message: makeErrorMessageUserFriendly(err.message, fieldName),
          };
        });
        next(new ValidationError('Invalid query parameters. Please check your filters', errors));
      } else {
        next(error);
      }
    }
  };
};
