import { getModelForClass, pre, prop, type Ref } from "@typegoose/typegoose";
import { z } from "zod";
import {
	createArraySchema,
	createBooleanSchema,
	createNumberSchema,
	createObjectIdSchema,
	createStringSchema,
} from "../../utils/schema.util";
import { Admin } from "./admin.model";

/**
 * Course Level Enum - Defines the difficulty levels for courses
 */
export enum CourseLevel {
	BEGINNER = "beginner",
	INTERMEDIATE = "intermediate",
	ADVANCED = "advanced",
}

/**
 * Course Model - Defines courses in the system
 * Types are defined here with Typegoose and reused for Zod validation
 */
@pre<Course>("save", function () {
	this.updatedAt = new Date();
})
export class Course {
	@prop({ required: true, trim: true })
	public title!: string;

	@prop({ required: true, trim: true })
	public overview!: string;

	@prop({ default: "" })
	public resources!: string;

	@prop({ default: "" })
	public image!: string;

	@prop({ default: [] })
	public categories!: string[];

	@prop({ default: null })
	public rating!: number;

	@prop({ default: null })
	public minute!: number;

	@prop({ default: null })
	public price!: number;

	@prop({ ref: () => Admin, type: () => String })
	public admin?: Ref<Admin>;

	@prop({ enum: CourseLevel, default: null })
	public level?: CourseLevel | null;

	@prop({ default: true })
	public isActive?: boolean;

	@prop({ default: Date.now })
	public createdAt?: Date;

	@prop({ default: Date.now })
	public updatedAt?: Date;
}

// Get the Mongoose model
export const CourseModel = getModelForClass(Course);

// Zod schemas derived from the Typegoose model
export const CourseCreateSchema = z.object({
	title: createStringSchema(true, 2, 200),
	overview: createStringSchema(true, 2, 2000),
	resources: createStringSchema(false, 0, 5000),
	image: createStringSchema(false, 0, 500),
	categories: createArraySchema(z.string().min(1).max(100), false),
	rating: createNumberSchema(false, 0, 5),
	minute: createNumberSchema(false, 0),
	price: createNumberSchema(false, 0),
	admin: createObjectIdSchema(false),
	level: z.enum(["beginner", "intermediate", "advanced"]).nullable().optional(),
	isActive: createBooleanSchema(false),
});

export const CourseUpdateSchema = CourseCreateSchema.partial();

// Type inference from Zod schemas
export type CourseCreateInput = z.infer<typeof CourseCreateSchema>;
export type CourseUpdateInput = z.infer<typeof CourseUpdateSchema>;
