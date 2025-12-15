import { getModelForClass, pre, prop } from "@typegoose/typegoose";
import { z } from "zod";
import {
	createBooleanSchema,
	createDateSchema,
	createEmailSchema,
	createNumberSchema,
	createStringSchema,
} from "../utils/schema.util";

/**
 * Student Model - Defines students in the LMS
 * Types are defined here with Typegoose and reused for Zod validation
 */
@pre<Student>("save", function () {
	this.updatedAt = new Date();
})
export class Student {
	@prop({ required: true, trim: true })
	public firstName!: string;

	@prop({ required: true, trim: true })
	public lastName!: string;

	@prop({ required: true, unique: true, lowercase: true, trim: true })
	public email!: string;

	@prop({ required: true })
	public password!: string;

	@prop({ trim: true })
	public phone?: string;

	@prop({ type: () => Date })
	public dateOfBirth?: Date;

	@prop({ trim: true })
	public address?: string;

	@prop({ default: 0 })
	public enrollmentYear?: number;

	@prop({ default: true })
	public isActive?: boolean;

	@prop({ default: Date.now })
	public createdAt?: Date;

	@prop({ default: Date.now })
	public updatedAt?: Date;
}

// Get the Mongoose model
export const StudentModel = getModelForClass(Student);

// Zod schemas derived from the Typegoose model
export const StudentCreateSchema = z.object({
	firstName: createStringSchema(true, 2, 50),
	lastName: createStringSchema(true, 2, 50),
	email: createEmailSchema(true),
	password: createStringSchema(true, 6, 100),
	phone: createStringSchema(false, 10, 15),
	dateOfBirth: createDateSchema(false),
	address: createStringSchema(false, 0, 200),
	enrollmentYear: createNumberSchema(false, 1900, 2100),
	isActive: createBooleanSchema(false),
});

export const StudentUpdateSchema = StudentCreateSchema.partial();

export const StudentLoginSchema = z.object({
	email: createEmailSchema(true),
	password: createStringSchema(true, 6, 100),
});

// Type inference from Zod schemas
export type StudentCreateInput = z.infer<typeof StudentCreateSchema>;
export type StudentUpdateInput = z.infer<typeof StudentUpdateSchema>;
export type StudentLoginInput = z.infer<typeof StudentLoginSchema>;
