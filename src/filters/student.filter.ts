import { z } from 'zod';
import { BaseFilterQuerySchema, buildSearchFilter, buildDateRangeFilter, mergeFilters } from '../utils/filter.util';

/**
 * Student Filter Builder and Validator
 */

/**
 * Student-specific filter query schema
 * Extends base filters with student-specific filters
 */
export const StudentFilterQuerySchema = BaseFilterQuerySchema.extend({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  enrollmentYear: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1900).max(2100)).optional(),
  isActive: z.enum(['true', 'false']).transform((val) => val === 'true').optional(),
});

export type StudentFilterQuery = z.infer<typeof StudentFilterQuerySchema>;

/**
 * Build MongoDB filter object from validated query parameters
 */
export const buildStudentFilter = (query: Partial<StudentFilterQuery>): Record<string, any> => {
  const filters: Record<string, any>[] = [];

  // Search filter - searches across name and email fields
  if (query.search) {
    filters.push(buildSearchFilter(query.search, ['firstName', 'lastName', 'email']));
  }

  // Date range filters
  const dateFilter = buildDateRangeFilter(query.createdBefore, query.createdAfter);
  if (Object.keys(dateFilter).length > 0) {
    filters.push(dateFilter);
  }

  // Field-specific filters
  const fieldFilters: Record<string, any> = {};

  if (query.firstName) {
    fieldFilters.firstName = new RegExp(query.firstName, 'i');
  }

  if (query.lastName) {
    fieldFilters.lastName = new RegExp(query.lastName, 'i');
  }

  if (query.email) {
    fieldFilters.email = new RegExp(query.email, 'i');
  }

  if (query.enrollmentYear !== undefined) {
    fieldFilters.enrollmentYear = query.enrollmentYear;
  }

  if (query.isActive !== undefined) {
    fieldFilters.isActive = query.isActive;
  }

  if (Object.keys(fieldFilters).length > 0) {
    filters.push(fieldFilters);
  }

  return mergeFilters(...filters);
};
