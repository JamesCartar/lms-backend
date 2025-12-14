/**
 * Role Seed Data
 * Defines roles with associated permissions
 * Permission IDs will be populated during seeding
 */
export const roleSeeds = [
  {
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: [
      'admin.create',
      'admin.read',
      'admin.update',
      'admin.delete',
      'role.create',
      'role.read',
      'role.update',
      'role.delete',
      'student.create',
      'student.read',
      'student.update',
      'student.delete',
      'permission.create',
      'permission.read',
      'permission.update',
      'permission.delete',
    ],
  },
  {
    name: 'Admin',
    description: 'Administrative access with limited permissions',
    permissions: [
      'admin.read',
      'role.read',
      'student.create',
      'student.read',
      'student.update',
      'student.delete',
      'permission.read',
    ],
  },
  {
    name: 'Manager',
    description: 'Can manage students and view system data',
    permissions: [
      'student.create',
      'student.read',
      'student.update',
      'role.read',
      'permission.read',
    ],
  },
  {
    name: 'Viewer',
    description: 'Read-only access to system data',
    permissions: [
      'admin.read',
      'role.read',
      'student.read',
      'permission.read',
    ],
  },
];
