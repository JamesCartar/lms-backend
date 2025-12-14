import { z } from 'zod';
import { Request } from 'express';

/**
 * Pagination query schema for validation
 */
export const PaginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1)).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1).max(100)).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type PaginationQuery = {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
};

/**
 * Pagination metadata interface
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Extract and validate pagination parameters from request query
 */
export const getPaginationParams = (req: Request): PaginationQuery => {
  const result = PaginationQuerySchema.safeParse(req.query);
  
  if (!result.success) {
    // Return default values if validation fails
    return {
      page: 1,
      limit: 10,
      sortOrder: 'desc',
    };
  }
  
  // Apply defaults for undefined values
  return {
    page: result.data.page ?? 1,
    limit: result.data.limit ?? 10,
    sortBy: result.data.sortBy,
    sortOrder: result.data.sortOrder ?? 'desc',
  };
};

/**
 * Calculate pagination metadata
 */
export const calculatePaginationMeta = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Create paginated response
 */
export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> => {
  return {
    data,
    pagination: calculatePaginationMeta(page, limit, total),
  };
};

/**
 * Calculate skip value for database query
 */
export const calculateSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};
