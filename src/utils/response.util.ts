import { Response } from 'express';
import { PaginationMeta } from './pagination.util';
import { ValidationErrors } from '../types/validation.types';

/**
 * Standard Response Format Interface
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
  errors?: ValidationErrors;
  timestamp: string;
}

/**
 * Send success response with consistent format
 */
export const sendSuccessResponse = <T = unknown>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
  pagination?: PaginationMeta
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send error response with consistent format
 */
export const sendErrorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: ValidationErrors
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};
