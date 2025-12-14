import type { FilterQuery } from "mongoose";
import { z } from "zod";
import type { Role } from "../models/role.model";
import {
	BaseFilterQuerySchema,
	buildDateRangeFilter,
	buildSearchFilter,
	mergeFilters,
} from "../utils/filter.util";

/**
 * Role Filter Builder and Validator
 */

/**
 * Role-specific filter query schema
 */
export const RoleFilterQuerySchema = BaseFilterQuerySchema.extend({
	name: z.string().min(1).max(50).optional(),
	description: z.string().min(1).max(200).optional(),
});

export type RoleFilterQuery = z.infer<typeof RoleFilterQuerySchema>;

/**
 * Build MongoDB filter object from validated query parameters
 */
export const buildRoleFilter = (
	query: Partial<RoleFilterQuery>,
): FilterQuery<Role> => {
	const filters: FilterQuery<Role>[] = [];

	// Search filter - searches across name and description fields
	if (query.search) {
		filters.push(buildSearchFilter(query.search, ["name", "description"]));
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
	const fieldFilters: FilterQuery<Role> = {};

	if (query.name) {
		fieldFilters.name = new RegExp(query.name, "i");
	}

	if (query.description) {
		fieldFilters.description = new RegExp(query.description, "i");
	}

	if (Object.keys(fieldFilters).length > 0) {
		filters.push(fieldFilters);
	}

	return mergeFilters(...filters);
};
