import { z } from "zod";
import {
	BaseFilterQuerySchema,
	buildDateRangeFilter,
	buildSearchFilter,
	type MongoFilter,
	mergeFilters,
} from "../utils/filter.util";

/**
 * UserLog Filter Builder and Validator
 */

/**
 * UserLog-specific filter query schema
 */
export const UserLogFilterQuerySchema = BaseFilterQuerySchema.extend({
	userId: z
		.string()
		.regex(/^[0-9a-fA-F]{24}$/)
		.optional(), // MongoDB ObjectId format
	userType: z.enum(["admin", "student"]).optional(),
	email: z.string().email().optional(),
	ip: z.string().min(1).max(45).optional(), // Support IPv4 and IPv6
});

export type UserLogFilterQuery = z.infer<typeof UserLogFilterQuerySchema>;

/**
 * Build MongoDB filter object from validated query parameters
 */
export const buildUserLogFilter = (
	query: Partial<UserLogFilterQuery>,
): MongoFilter => {
	const filters: MongoFilter[] = [];

	// Search filter - searches across email and IP fields
	if (query.search) {
		filters.push(buildSearchFilter(query.search, ["email", "ip"]));
	}

	// Date range filters - UserLog uses 'loginTime' field instead of 'createdAt'
	const dateFilter = buildDateRangeFilter(
		query.createdBefore,
		query.createdAfter,
		"loginTime",
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

	if (query.ip) {
		fieldFilters.ip = new RegExp(query.ip, "i");
	}

	if (Object.keys(fieldFilters).length > 0) {
		filters.push(fieldFilters);
	}

	return mergeFilters(...filters);
};
