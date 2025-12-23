import "dotenv/config";
import type { DocumentType } from "@typegoose/typegoose";
import bcrypt from "bcryptjs";
import { connectDatabase } from "../../config/database";
import { AdminModel } from "../models/admin.model";
import { type Permission, PermissionModel } from "../models/permission.model";
import { type Role, RoleModel } from "../models/role.model";
import { StudentModel } from "../models/student.model";
import { permissionSeeds } from "./permission.seed";
import { roleSeeds } from "./role.seed";
import { studentSeeds } from "./student.seed";

/**
 * Seed Database Script
 * Populates the database with initial data
 */

const SALT_ROUNDS = 10;

const seedPermissions = async () => {
	console.log("Seeding permissions...");

	// Clear existing permissions
	await PermissionModel.deleteMany({});

	// Insert permissions
	const permissions = await PermissionModel.insertMany(permissionSeeds);
	console.log(`✓ Created ${permissions.length} permissions`);

	return permissions;
};

const seedRoles = async (permissions: DocumentType<Permission>[]) => {
	console.log("Seeding roles...");

	// Clear existing roles
	await RoleModel.deleteMany({});

	// Create a map of permission names to IDs
	const permissionMap = new Map(
		permissions.map((p) => [p.name, p._id.toString()]),
	);

	// Insert roles with permission IDs
	const roles: DocumentType<Role>[] = [];
	for (const roleSeed of roleSeeds) {
		const permissionIds = roleSeed.permissions
			.map((permName) => permissionMap.get(permName))
			.filter((id): id is string => id !== undefined);

		const role = await RoleModel.create({
			name: roleSeed.name,
			description: roleSeed.description,
			permissions: permissionIds,
		});

		roles.push(role);
	}

	console.log(`✓ Created ${roles.length} roles`);

	return roles;
};

const seedStudents = async () => {
	console.log("Seeding students...");

	// Clear existing students
	await StudentModel.deleteMany({});

	// Hash passwords and insert students
	const studentsWithHashedPasswords = await Promise.all(
		studentSeeds.map(async (student) => ({
			...student,
			password: await bcrypt.hash(student.password, SALT_ROUNDS),
		})),
	);

	const students = await StudentModel.insertMany(studentsWithHashedPasswords);
	console.log(`✓ Created ${students.length} students`);

	return students;
};

const seedAdmin = async (roles: DocumentType<Role>[]) => {
	console.log("Seeding admin user...");

	// Clear existing admins
	await AdminModel.deleteMany({});

	// Find Super Admin role
	const superAdminRole = roles.find((r) => r.name === "Super Admin");

	// Create default super admin
	const hashedPassword = await bcrypt.hash("admin123", SALT_ROUNDS);
	const admin = await AdminModel.create({
		name: "Super Admin",
		email: "admin@example.com",
		password: hashedPassword,
		role: superAdminRole?._id,
		isActive: true,
	});

	console.log(
		`✓ Created admin user (email: admin@example.com, password: admin123)`,
	);

	return admin;
};

const seed = async () => {
	try {
		console.log("Starting database seeding...\n");

		// Connect to database
		await connectDatabase();

		// Run seeds in order
		const permissions = await seedPermissions();
		const roles = await seedRoles(permissions);
		await seedStudents();
		await seedAdmin(roles);

		console.log("\n✅ Database seeding completed successfully!");
		console.log("\nDefault credentials:");
		console.log("  Admin: admin@example.com / admin123");
		console.log("  Student: john.doe@example.com / password123");

		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		process.exit(1);
	}
};

// Run seed script
seed();
