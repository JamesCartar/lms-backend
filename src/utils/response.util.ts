import { Response } from 'express';
import { PaginationMeta } from './pagination.util';
import { ValidationErrors } from '../types/validation.types';

/**
 * Standard Response Format Interface
 * Note: Pagination is now part of data when present
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ValidationErrors;
  timestamp: string;
}

/**
 * Paginated data wrapper
 */
export interface PaginatedData<T> {
  items: T;
  pagination: PaginationMeta;
}

/**
 * Send success response with consistent format
 * If pagination is provided, data is wrapped with pagination
 */
export const sendSuccessResponse = <T = unknown>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
  pagination?: PaginationMeta
): Response => {
  const responseData = pagination 
    ? { items: data, pagination }
    : data;

  const response: ApiResponse<typeof responseData> = {
    success: true,
    message,
    data: responseData,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Send success response with data wrapped in a resource key
 * If pagination is provided, data is wrapped with pagination
 */
export const sendSuccessResponseWithResource = <T = unknown>(
  res: Response,
  data: T,
  resourceKey: string,
  message?: string,
  statusCode: number = 200,
  pagination?: PaginationMeta
): Response => {
  type WrappedData = { [key: string]: T };
  const wrappedData: WrappedData = { [resourceKey]: data };
  
  const responseData = pagination 
    ? { items: wrappedData, pagination }
    : wrappedData;

  const response: ApiResponse<typeof responseData> = {
    success: true,
    message,
    data: responseData,
    timestamp: new Date().toISOString(),
  };

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
