import { z } from "zod";
import {
	BaseFilterQuerySchema,
	buildSearchFilter,
	buildDateRangeFilter,
	mergeFilters,
	type MongoFilter,
} from "../utils/filter.util";

/**
 * Permission Filter Builder and Validator
 */

/**
 * Permission-specific filter query schema
 */
export const PermissionFilterQuerySchema = BaseFilterQuerySchema.extend({
	name: z.string().min(1).max(50).optional(),
	resource: z.string().min(1).max(50).optional(),
	action: z.string().min(1).max(50).optional(),
	description: z.string().min(1).max(200).optional(),
});

export type PermissionFilterQuery = z.infer<typeof PermissionFilterQuerySchema>;

/**
 * Build MongoDB filter object from validated query parameters
 */
export const buildPermissionFilter = (
	query: Partial<PermissionFilterQuery>,
): MongoFilter => {
	const filters: MongoFilter[] = [];

	// Search filter - searches across name, resource, action, and description fields
	if (query.search) {
		filters.push(
			buildSearchFilter(query.search, [
				"name",
				"resource",
				"action",
				"description",
			]),
		);
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

	if (query.resource) {
		fieldFilters.resource = new RegExp(query.resource, "i");
	}

	if (query.action) {
		fieldFilters.action = new RegExp(query.action, "i");
	}

	if (query.description) {
		fieldFilters.description = new RegExp(query.description, "i");
	}

	if (Object.keys(fieldFilters).length > 0) {
		filters.push(fieldFilters);
	}

	return mergeFilters(...filters);
};
