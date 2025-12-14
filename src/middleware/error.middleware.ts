import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '../utils/errors.util';
import { sendErrorResponse } from '../utils/response.util';

/**
 * Global Error Handler Middleware
 * Handles all types of errors and sends consistent error responses
 */
export const errorHandler = (
  error: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  // Log error for debugging
  console.error('Error:', error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const errors = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return sendErrorResponse(res, 'Validation failed', 422, errors);
  }

  // Handle custom application errors
  if (error instanceof AppError) {
    return sendErrorResponse(
      res,
      error.message,
      error.statusCode,
      error instanceof ValidationError ? error.errors : undefined
    );
  }

  // Handle Mongoose/MongoDB errors
  if (error.name === 'ValidationError') {
    return sendErrorResponse(res, 'Database validation error', 400);
  }

  if (error.name === 'CastError') {
    return sendErrorResponse(res, 'Invalid ID format', 400);
  }

  if (error.name === 'MongoServerError' || ('code' in error && (error as { code: number }).code === 11000)) {
    return sendErrorResponse(res, 'Duplicate key error', 409);
  }

  // Handle generic errors
  const statusCode = 'statusCode' in error && typeof (error as { statusCode: number }).statusCode === 'number'
    ? (error as { statusCode: number }).statusCode
    : 500;
  const message = error.message || 'Internal server error';

  return sendErrorResponse(res, message, statusCode);
};

/**
 * Async handler wrapper to catch async errors
 * Wraps async route handlers to catch errors and pass to error handler
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
