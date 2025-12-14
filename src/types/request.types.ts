/**
 * Request Type Extensions
 * Extends Express Request interface to include validated query types
 */

import type { AdminFilterQuery } from '../filters/admin.filter';
import type { AuditLogFilterQuery } from '../filters/auditlog.filter';
import type { PermissionFilterQuery } from '../filters/permission.filter';
import type { RoleFilterQuery } from '../filters/role.filter';
import type { StudentFilterQuery } from '../filters/student.filter';
import type { UserLogFilterQuery } from '../filters/userlog.filter';

/**
 * Union type of all possible filter queries
 */
export type ValidatedQuery = 
  | AdminFilterQuery
  | AuditLogFilterQuery
  | PermissionFilterQuery
  | RoleFilterQuery
  | StudentFilterQuery
  | UserLogFilterQuery;

/**
 * Extend Express Request to include validated query
 */
declare global {
  namespace Express {
    interface Request {
      validatedQuery?: ValidatedQuery;
    }
  }
}
