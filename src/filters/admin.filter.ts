import { z } from "zod";
import {
	BaseFilterQuerySchema,
	buildDateRangeFilter,
	buildSearchFilter,
	type MongoFilter,
	mergeFilters,
} from "../utils/filter.util";

/**
 * Admin Filter Builder and Validator
 */

/**
 * Admin-specific filter query schema
 */
export const AdminFilterQuerySchema = BaseFilterQuerySchema.extend({
	name: z.string().min(1).max(100).optional(),
	email: z.string().email().optional(),
	role: z
		.string()
		.regex(/^[0-9a-fA-F]{24}$/)
		.optional(), // MongoDB ObjectId format
	isActive: z
		.enum(["true", "false"])
		.transform((val) => val === "true")
		.optional(),
});

export type AdminFilterQuery = z.infer<typeof AdminFilterQuerySchema>;

/**
 * Build MongoDB filter object from validated query parameters
 */
export const buildAdminFilter = (
	query: Partial<AdminFilterQuery>,
): MongoFilter => {
	const filters: MongoFilter[] = [];

	// Search filter - searches across name and email fields
	if (query.search) {
		filters.push(buildSearchFilter(query.search, ["name", "email"]));
	}

	// Date range filters
	const dateFilter = buildDateRangeFilter(
		query.createdBefore,
		query.createdAfter,
	);
	if (Object.keys(dateFilter).length > 0) {
		filters.push(dateFilter);
	}

	// Field-specific filters
	const fieldFilters: MongoFilter = {};

	if (query.name) {
		fieldFilters.name = new RegExp(query.name, "i");
	}

	if (query.email) {
		fieldFilters.email = new RegExp(query.email, "i");
	}

	if (query.role) {
		fieldFilters.role = query.role;
	}

	if (query.isActive !== undefined) {
		fieldFilters.isActive = query.isActive;
	}

	if (Object.keys(fieldFilters).length > 0) {
		filters.push(fieldFilters);
	}

	return mergeFilters(...filters);
};
