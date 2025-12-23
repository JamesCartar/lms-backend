/**
 * Permission Seed Data
 * Defines permissions for admin CRUD, role CRUD, and student CRUD
 */
export const permissionSeeds = [
	// Admin CRUD Permissions
	{
		name: "admin.create",
		resource: "admin",
		action: "create",
		description: "Create new admin users",
	},
	{
		name: "admin.read",
		resource: "admin",
		action: "read",
		description: "View admin users",
	},
	{
		name: "admin.update",
		resource: "admin",
		action: "update",
		description: "Update admin users",
	},
	{
		name: "admin.delete",
		resource: "admin",
		action: "delete",
		description: "Delete admin users",
	},

	// Role CRUD Permissions
	{
		name: "role.create",
		resource: "role",
		action: "create",
		description: "Create new roles",
	},
	{
		name: "role.read",
		resource: "role",
		action: "read",
		description: "View roles",
	},
	{
		name: "role.update",
		resource: "role",
		action: "update",
		description: "Update roles",
	},
	{
		name: "role.delete",
		resource: "role",
		action: "delete",
		description: "Delete roles",
	},

	// Student CRUD Permissions
	{
		name: "student.create",
		resource: "student",
		action: "create",
		description: "Create new students",
	},
	{
		name: "student.read",
		resource: "student",
		action: "read",
		description: "View students",
	},
	{
		name: "student.update",
		resource: "student",
		action: "update",
		description: "Update students",
	},
	{
		name: "student.delete",
		resource: "student",
		action: "delete",
		description: "Delete students",
	},

	// Permission CRUD Permissions
	{
		name: "permission.create",
		resource: "permission",
		action: "create",
		description: "Create new permissions",
	},
	{
		name: "permission.read",
		resource: "permission",
		action: "read",
		description: "View permissions",
	},
	{
		name: "permission.update",
		resource: "permission",
		action: "update",
		description: "Update permissions",
	},
	{
		name: "permission.delete",
		resource: "permission",
		action: "delete",
		description: "Delete permissions",
	},
];
