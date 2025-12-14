import { prop, getModelForClass } from '@typegoose/typegoose';
import { z } from 'zod';
import { createStringSchema } from '../utils/schema.util';

/**
 * Permission Model - Defines permissions in the system
 * Types are defined here with Typegoose and reused for Zod validation
 */
export class Permission {
  @prop({ required: true, unique: true, trim: true })
  public name!: string;

  @prop({ required: true, trim: true })
  public resource!: string;

  @prop({ required: true, trim: true })
  public action!: string;

  @prop({ trim: true })
  public description?: string;

  @prop({ default: Date.now })
  public createdAt?: Date;

  @prop({ default: Date.now })
  public updatedAt?: Date;
}

// Get the Mongoose model
export const PermissionModel = getModelForClass(Permission);

// Zod schemas derived from the Typegoose model
export const PermissionCreateSchema = z.object({
  name: createStringSchema(true, 3, 50),
  resource: createStringSchema(true, 3, 50),
  action: createStringSchema(true, 3, 50),
  description: createStringSchema(false, 0, 200),
});

export const PermissionUpdateSchema = z.object({
  name: createStringSchema(false, 3, 50),
  resource: createStringSchema(false, 3, 50),
  action: createStringSchema(false, 3, 50),
  description: createStringSchema(false, 0, 200),
});

// Type inference from Zod schemas
export type PermissionCreateInput = z.infer<typeof PermissionCreateSchema>;
export type PermissionUpdateInput = z.infer<typeof PermissionUpdateSchema>;
