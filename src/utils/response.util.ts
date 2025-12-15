import type { Response } from "express";
import type { PaginationMeta } from "./pagination.util";
import type { ValidationErrors } from "../types/validation.types";

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
 * Options for sendSuccessResponse
 */
export interface SendSuccessResponseOptions<T = unknown> {
	data: T;
	message?: string;
	statusCode?: number;
	pagination?: PaginationMeta;
	resourceKey?: string;
}

/**
 * Send success response with consistent format
 * If pagination is provided, data is wrapped with pagination
 * If resourceKey is provided, data is wrapped in a resource object
 */
export const sendSuccessResponse = <T = unknown>(
	res: Response,
	options: SendSuccessResponseOptions<T>,
): Response => {
	const { data, message, statusCode = 200, pagination, resourceKey } = options;

	// Wrap data in resource key if provided
	const wrappedData = resourceKey ? { [resourceKey]: data } : data;

	// Wrap with pagination if provided
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
	errors?: ValidationErrors,
): Response => {
	const response: ApiResponse = {
		success: false,
		message,
		errors,
		timestamp: new Date().toISOString(),
	};

	return res.status(statusCode).json(response);
};
