/**
 * Populated Document Types
 * Used for strongly typing populated Mongoose documents with Typegoose
 */

import type { DocumentType } from '@typegoose/typegoose';
import type { Role } from '../models/role.model';
import type { Permission } from '../models/permission.model';

/**
 * Represents a Role with populated permissions
 */
export type PopulatedRole = Omit<DocumentType<Role>, 'permissions'> & {
  permissions: DocumentType<Permission>[];
};

/**
 * Type guard to check if role has populated permissions
 */
export function isPopulatedRole(role: unknown): role is PopulatedRole {
  return (
    typeof role === 'object' &&
    role !== null &&
    'permissions' in role &&
    Array.isArray((role as PopulatedRole).permissions)
  );
}

/**
 * Type guard to check if permissions array contains Permission documents
 */
export function hasPermissionDocuments(permissions: unknown): permissions is DocumentType<Permission>[] {
  return (
    Array.isArray(permissions) &&
    permissions.every(p => typeof p === 'object' && p !== null && 'name' in p)
  );
}
