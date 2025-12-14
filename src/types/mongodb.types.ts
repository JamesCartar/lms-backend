import type { FilterQuery } from "mongoose";

/**
 * MongoDB Filter Types
 * Provides type-safe alternatives to Record<string, any> for MongoDB filters
 */

/**
 * Generic MongoDB filter type that accepts any document type
 * Use this when you don't have a specific document type available
 */
export type MongoFilter<T = unknown> = FilterQuery<T>;

/**
 * Type for MongoDB date range operators
 */
export interface DateRangeOperator {
	$lte?: Date;
	$gte?: Date;
	$lt?: Date;
	$gt?: Date;
}

/**
 * Type for MongoDB logical operators
 */
export interface MongoLogicalFilter<T = unknown> {
	$and?: FilterQuery<T>[];
	$or?: FilterQuery<T>[];
	$nor?: FilterQuery<T>[];
	$not?: FilterQuery<T>;
}

/**
 * Type for changes tracked in audit logs
 */
export type AuditLogChanges = Record<string, unknown>;
