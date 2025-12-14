import { Response } from 'express';

/**
 * Standard Response Format Interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  timestamp: string;
}

/**
 * Send success response with consistent format
 */
export const sendSuccessResponse = <T = any>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
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
  errors?: any[]
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};
