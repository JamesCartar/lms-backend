/**
 * Custom Error Classes for LMS Backend
 * These provide consistent error handling across the application
 */

import { ValidationErrors } from '../types/validation.types';

/**
 * Base Application Error
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request Error
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'The request is invalid. Please check your input') {
    super(message, 400);
  }
}

/**
 * 401 Unauthorized Error
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'You need to be logged in to access this resource') {
    super(message, 401);
  }
}

/**
 * 403 Forbidden Error
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'You do not have permission to access this resource') {
    super(message, 403);
  }
}

/**
 * 404 Not Found Error
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'The requested resource was not found') {
    super(message, 404);
  }
}

/**
 * 409 Conflict Error
 */
export class ConflictError extends AppError {
  constructor(message: string = 'This operation conflicts with existing data') {
    super(message, 409);
  }
}

/**
 * 422 Validation Error
 */
export class ValidationError extends AppError {
  public errors?: ValidationErrors;

  constructor(message: string = 'Please check your input and try again', errors?: ValidationErrors) {
    super(message, 422);
    this.errors = errors;
  }
}

/**
 * 500 Database Error
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'A database error occurred. Please try again') {
    super(message, 500);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'An unexpected error occurred. Please try again later') {
    super(message, 500);
  }
}
