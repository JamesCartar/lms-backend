import { z } from "zod";
import {
	BaseFilterQuerySchema,
	buildDateRangeFilter,
	buildSearchFilter,
	type MongoFilter,
	mergeFilters,
} from "../utils/filter.util";

/**
 * AuditLog Filter Builder and Validator
 */

/**
 * AuditLog-specific filter query schema
 */
export const AuditLogFilterQuerySchema = BaseFilterQuerySchema.extend({
	userId: z
		.string()
		.regex(/^[0-9a-fA-F]{24}$/)
		.optional(), // MongoDB ObjectId format
	userType: z.enum(["admin", "student"]).optional(),
	email: z.string().email().optional(),
	action: z.enum(["CREATE", "UPDATE", "DELETE"]).optional(),
	resource: z.string().min(1).max(100).optional(),
	resourceId: z
		.string()
		.regex(/^[0-9a-fA-F]{24}$/)
		.optional(),
});

export type AuditLogFilterQuery = z.infer<typeof AuditLogFilterQuerySchema>;

/**
 * Build MongoDB filter object from validated query parameters
 */
export const buildAuditLogFilter = (
	query: Partial<AuditLogFilterQuery>,
): MongoFilter => {
	const filters: MongoFilter[] = [];

	// Search filter - searches across email and resource fields
	if (query.search) {
		filters.push(buildSearchFilter(query.search, ["email", "resource"]));
	}

	// Date range filters - AuditLog uses 'timestamp' field instead of 'createdAt'
	const dateFilter = buildDateRangeFilter(
		query.createdBefore,
		query.createdAfter,
		"timestamp",
	);
	if (Object.keys(dateFilter).length > 0) {
		filters.push(dateFilter);
	}

	// Field-specific filters
	const fieldFilters: MongoFilter = {};

	if (query.userId) {
		fieldFilters.userId = query.userId;
	}

	if (query.userType) {
		fieldFilters.userType = query.userType;
	}

	if (query.email) {
		fieldFilters.email = new RegExp(query.email, "i");
	}

	if (query.action) {
		fieldFilters.action = query.action;
	}

	if (query.resource) {
		fieldFilters.resource = new RegExp(query.resource, "i");
	}

	if (query.resourceId) {
		fieldFilters.resourceId = query.resourceId;
	}

	if (Object.keys(fieldFilters).length > 0) {
		filters.push(fieldFilters);
	}

	return mergeFilters(...filters);
};
