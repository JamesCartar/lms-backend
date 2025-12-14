import { prop, getModelForClass, type Ref } from '@typegoose/typegoose';
import { z } from 'zod';
import { createStringSchema, createArraySchema, createObjectIdSchema } from '../utils/schema.util';
import { Permission } from './permission.model';

/**
 * Role Model - Defines roles in the system with associated permissions
 * Types are defined here with Typegoose and reused for Zod validation
 */
export class Role {
  @prop({ required: true, unique: true, trim: true })
  public name!: string;

  @prop({ trim: true })
  public description?: string;

  @prop({ ref: () => Permission, type: () => [String] })
  public permissions?: Ref<Permission>[];

  @prop({ enum: ['system', 'custom'], default: 'custom' })
  public type?: string;

  @prop({ default: Date.now })
  public createdAt?: Date;

  @prop({ default: Date.now })
  public updatedAt?: Date;
}

// Get the Mongoose model
export const RoleModel = getModelForClass(Role);

// Zod schemas derived from the Typegoose model
export const RoleCreateSchema = z.object({
  name: createStringSchema(true, 3, 50),
  description: createStringSchema(false, 0, 200),
  permissions: createArraySchema(createObjectIdSchema(), false),
  type: z.enum(['system', 'custom']).optional(),
});

export const RoleUpdateSchema = z.object({
  name: createStringSchema(false, 3, 50),
  description: createStringSchema(false, 0, 200),
  permissions: createArraySchema(createObjectIdSchema(), false),
  type: z.enum(['system', 'custom']).optional(),
});

// Type inference from Zod schemas
export type RoleCreateInput = z.infer<typeof RoleCreateSchema>;
export type RoleUpdateInput = z.infer<typeof RoleUpdateSchema>;
