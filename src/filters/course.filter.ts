import { z } from "zod";
import {
	BaseFilterQuerySchema,
	buildDateRangeFilter,
	buildSearchFilter,
	type MongoFilter,
	mergeFilters,
} from "../utils/filter.util";

/**
 * Course Filter Builder and Validator
 */

/**
 * Course-specific filter query schema
 */
export const CourseFilterQuerySchema = BaseFilterQuerySchema.extend({
	title: z.string().min(1).max(200).optional(),
	categories: z.string().min(1).max(100).optional(), // Comma-separated categories
	level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
	minPrice: z
		.string()
		.regex(/^\d+(\.\d+)?$/)
		.transform(Number)
		.optional(),
	maxPrice: z
		.string()
		.regex(/^\d+(\.\d+)?$/)
		.transform(Number)
		.optional(),
	minRating: z
		.string()
		.regex(/^\d+(\.\d+)?$/)
		.transform(Number)
		.optional(),
	admin: z
		.string()
		.regex(/^[0-9a-fA-F]{24}$/)
		.optional(), // MongoDB ObjectId format
	isActive: z
		.enum(["true", "false"])
		.transform((val) => val === "true")
		.optional(),
});

export type CourseFilterQuery = z.infer<typeof CourseFilterQuerySchema>;

/**
 * Build MongoDB filter object from validated query parameters
 */
export const buildCourseFilter = (
	query: Partial<CourseFilterQuery>,
): MongoFilter => {
	const filters: MongoFilter[] = [];

	// Search filter - searches across title and overview fields
	if (query.search) {
		filters.push(buildSearchFilter(query.search, ["title", "overview"]));
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

	if (query.title) {
		fieldFilters.title = new RegExp(query.title, "i");
	}

	if (query.categories) {
		// Support comma-separated categories
		const categoryList = query.categories.split(",").map((c) => c.trim());
		fieldFilters.categories = { $in: categoryList };
	}

	if (query.level) {
		fieldFilters.level = query.level;
	}

	// Price range filter
	if (query.minPrice !== undefined || query.maxPrice !== undefined) {
		const priceFilter: { $gte?: number; $lte?: number } = {};
		if (query.minPrice !== undefined) {
			priceFilter.$gte = query.minPrice;
		}
		if (query.maxPrice !== undefined) {
			priceFilter.$lte = query.maxPrice;
		}
		fieldFilters.price = priceFilter;
	}

	// Minimum rating filter
	if (query.minRating !== undefined) {
		fieldFilters.rating = { $gte: query.minRating };
	}

	if (query.admin) {
		fieldFilters.admin = query.admin;
	}

	if (query.isActive !== undefined) {
		fieldFilters.isActive = query.isActive;
	}

	if (Object.keys(fieldFilters).length > 0) {
		filters.push(fieldFilters);
	}

	return mergeFilters(...filters);
};
