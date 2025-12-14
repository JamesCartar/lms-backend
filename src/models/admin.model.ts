import { getModelForClass, pre, prop, type Ref } from "@typegoose/typegoose";
import { z } from "zod";
import {
	createBooleanSchema,
	createEmailSchema,
	createObjectIdSchema,
	createStringSchema,
} from "../utils/schema.util";
import { Role } from "./role.model";

/**
 * Admin Model - Defines admin users in the system
 * Types are defined here with Typegoose and reused for Zod validation
 */
@pre<Admin>("save", function () {
	this.updatedAt = new Date();
})
export class Admin {
	@prop({ required: true, trim: true })
	public name!: string;

	@prop({ required: true, unique: true, lowercase: true, trim: true })
	public email!: string;

	@prop({ required: true })
	public password!: string;

	@prop({ ref: () => Role, type: () => String })
	public role?: Ref<Role>;

	@prop({ default: true })
	public isActive?: boolean;

	@prop({ default: Date.now })
	public createdAt?: Date;

	@prop({ default: Date.now })
	public updatedAt?: Date;
}

// Get the Mongoose model
export const AdminModel = getModelForClass(Admin);

// Zod schemas derived from the Typegoose model
export const AdminCreateSchema = z.object({
	name: createStringSchema(true, 2, 100),
	email: createEmailSchema(true),
	password: createStringSchema(true, 6, 100),
	role: createObjectIdSchema(false),
	isActive: createBooleanSchema(false),
});

export const AdminUpdateSchema = z.object({
	name: createStringSchema(false, 2, 100),
	email: createEmailSchema(false),
	password: createStringSchema(false, 6, 100),
	role: createObjectIdSchema(false),
	isActive: createBooleanSchema(false),
});

export const AdminLoginSchema = z.object({
	email: createEmailSchema(true),
	password: createStringSchema(true, 6, 100),
});

// Type inference from Zod schemas
export type AdminCreateInput = z.infer<typeof AdminCreateSchema>;
export type AdminUpdateInput = z.infer<typeof AdminUpdateSchema>;
export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;
