/**
 * Validation Error Types
 * Used for consistent error handling in validation scenarios
 */

/**
 * Represents a single validation error field
 */
export interface ValidationErrorField {
	field: string;
	message: string;
}

/**
 * Type alias for validation error arrays
 */
export type ValidationErrors = ValidationErrorField[];
