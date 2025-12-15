import { z } from "zod";
import { Types } from "mongoose";

/**
 * Utility to create Zod schemas from Typegoose model properties
 * This allows us to define types once in Typegoose and derive validation schemas
 */

// Base schema helpers with proper type inference
export function createStringSchema(
	required: true,
	minLength?: number,
	maxLength?: number,
): z.ZodString;
export function createStringSchema(
	required: false,
	minLength?: number,
	maxLength?: number,
): z.ZodOptional<z.ZodString>;
export function createStringSchema(
	required: boolean = true,
	minLength?: number,
	maxLength?: number,
): z.ZodString | z.ZodOptional<z.ZodString> {
	let schema = z.string();
	if (minLength) schema = schema.min(minLength);
	if (maxLength) schema = schema.max(maxLength);
	return required ? schema : schema.optional();
}

export function createEmailSchema(required: true): z.ZodString;
export function createEmailSchema(required: false): z.ZodOptional<z.ZodString>;
export function createEmailSchema(
	required: boolean = true,
): z.ZodString | z.ZodOptional<z.ZodString> {
	const schema = z.string().email();
	return required ? schema : schema.optional();
}

export function createNumberSchema(
	required: true,
	min?: number,
	max?: number,
): z.ZodNumber;
export function createNumberSchema(
	required: false,
	min?: number,
	max?: number,
): z.ZodOptional<z.ZodNumber>;
export function createNumberSchema(
	required: boolean = true,
	min?: number,
	max?: number,
): z.ZodNumber | z.ZodOptional<z.ZodNumber> {
	let schema = z.number();
	if (min !== undefined) schema = schema.min(min);
	if (max !== undefined) schema = schema.max(max);
	return required ? schema : schema.optional();
}

export function createDateSchema(required: true): z.ZodType<Date>;
export function createDateSchema(required: false): z.ZodType<Date | undefined>;
export function createDateSchema(
	required: boolean = true,
): z.ZodType<Date> | z.ZodType<Date | undefined> {
	const schema = z
		.union([z.string().datetime(), z.date()])
		.transform((val: string | Date) =>
			typeof val === "string" ? new Date(val) : val,
		);
	return required ? schema : schema.optional();
}

export function createBooleanSchema(required: true): z.ZodBoolean;
export function createBooleanSchema(
	required: false,
): z.ZodOptional<z.ZodBoolean>;
export function createBooleanSchema(
	required: boolean = true,
): z.ZodBoolean | z.ZodOptional<z.ZodBoolean> {
	const schema = z.boolean();
	return required ? schema : schema.optional();
}

export function createArraySchema<T extends z.ZodTypeAny>(
	itemSchema: T,
	required: true,
): z.ZodArray<T>;
export function createArraySchema<T extends z.ZodTypeAny>(
	itemSchema: T,
	required: false,
): z.ZodOptional<z.ZodArray<T>>;
export function createArraySchema<T extends z.ZodTypeAny>(
	itemSchema: T,
	required: boolean = true,
): z.ZodArray<T> | z.ZodOptional<z.ZodArray<T>> {
	const schema = z.array(itemSchema);
	return required ? schema : schema.optional();
}

export function createObjectIdSchema(required: true): z.ZodString;
export function createObjectIdSchema(
	required: false,
): z.ZodOptional<z.ZodString>;
export function createObjectIdSchema(
	required: boolean = true,
): z.ZodString | z.ZodOptional<z.ZodString> {
	const schema = z.string().regex(/^[0-9a-fA-F]{24}$/);
	return required ? schema : schema.optional();
}

export function createEnumSchema<T extends [string, ...string[]]>(
	values: T,
	required: true,
): any;
export function createEnumSchema<T extends [string, ...string[]]>(
	values: T,
	required: false,
): any;
export function createEnumSchema<T extends [string, ...string[]]>(
	values: T,
	required: boolean = true,
): any {
	const schema = z.enum(values);
	return required ? schema : schema.optional();
}

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
