import { z } from "zod";
import { Types } from "mongoose";

/**
 * Utility to create Zod schemas from Typegoose model properties
 * This allows us to define types once in Typegoose and derive validation schemas
 */

// Base schema helpers
export const createStringSchema = (
	required: boolean = true,
	minLength?: number,
	maxLength?: number,
) => {
	let schema = z.string();
	if (minLength) schema = schema.min(minLength);
	if (maxLength) schema = schema.max(maxLength);
	return required ? schema : schema.optional();
};

export const createEmailSchema = (required: boolean = true) => {
	const schema = z.string().email();
	return required ? schema : schema.optional();
};

export const createNumberSchema = (
	required: boolean = true,
	min?: number,
	max?: number,
) => {
	let schema = z.number();
	if (min !== undefined) schema = schema.min(min);
	if (max !== undefined) schema = schema.max(max);
	return required ? schema : schema.optional();
};

export const createDateSchema = (required: boolean = true) => {
	const schema = z
		.union([z.string().datetime(), z.date()])
		.transform((val: string | Date) =>
			typeof val === "string" ? new Date(val) : val,
		);
	return required ? schema : schema.optional();
};

export const createBooleanSchema = (required: boolean = true) => {
	const schema = z.boolean();
	return required ? schema : schema.optional();
};

export const createArraySchema = (
	itemSchema: z.ZodTypeAny,
	required: boolean = true,
) => {
	const schema = z.array(itemSchema);
	return required ? schema : schema.optional();
};

export const createObjectIdSchema = (required: boolean = true) => {
	const schema = z.string().regex(/^[0-9a-fA-F]{24}$/);
	return required ? schema : schema.optional();
};

export const createEnumSchema = <T extends [string, ...string[]]>(
	values: T,
	required: boolean = true,
) => {
	const schema = z.enum(values);
	return required ? schema : schema.optional();
};

/**
 * Converts a string ObjectId to a Mongoose Types.ObjectId
 * This is useful when passing validated Zod input to Mongoose/Typegoose
 */
export const toObjectId = (id: string): Types.ObjectId => {
	return new Types.ObjectId(id);
};

/**
 * Converts an array of string ObjectIds to Mongoose Types.ObjectId array
 */
export const toObjectIdArray = (ids: string[]): Types.ObjectId[] => {
	return ids.map((id) => new Types.ObjectId(id));
};
