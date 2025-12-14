import { getModelForClass, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import type { AuditLogChanges } from "../types/mongodb.types";

/**
 * AuditLog Model - Tracks user actions and resource changes
 * Records user actions (CREATE, UPDATE, DELETE) and affected resources
 */
export class AuditLog {
	@prop({ required: true, ref: () => "User" })
	public userId!: Types.ObjectId;

	@prop({ required: true })
	public userType!: "admin" | "student";

	@prop({ required: true })
	public email!: string;

	@prop({ required: true })
	public action!: "CREATE" | "UPDATE" | "DELETE";

	@prop({ required: true })
	public resource!: string;

	@prop({ type: () => Types.ObjectId })
	public resourceId?: Types.ObjectId;

	@prop({ type: () => Object })
	public changes?: AuditLogChanges;

	@prop({ trim: true })
	public ip?: string;

	@prop({ trim: true })
	public userAgent?: string;

	@prop({ default: Date.now })
	public timestamp!: Date;
}

// Get the Mongoose model
export const AuditLogModel = getModelForClass(AuditLog, {
	schemaOptions: {
		collection: "auditlogs",
		timestamps: false,
	},
});
