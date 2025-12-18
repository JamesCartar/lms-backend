import assert from "node:assert/strict";
import { before, beforeEach, describe, it } from "node:test";
import express, { type Application } from "express";
import jwt from "jsonwebtoken";
import supertest from "supertest";
import type { AdminService } from "../../src/services/admin.service";
import type { AdminController } from "../../src/controllers/admin.controller";
import type { createAdminRouter } from "../../src/routes/admin.routes";
import type { errorHandler } from "../../src/middleware/error.middleware";

type AdminRecord = {
	_id: string;
	name: string;
	email: string;
	password: string;
	role?: string;
	isActive?: boolean;
	createdAt: Date;
	updatedAt: Date;
};

class InMemoryAdminRepository {
	private data: AdminRecord[] = [];

	async create(data: Record<string, unknown>) {
		const id = (this.data.length + 1).toString().padStart(24, "0");
		const record: AdminRecord = {
			_id: id,
			name: typeof data.name === "string" ? data.name : "",
			email: typeof data.email === "string" ? data.email : "",
			password: typeof data.password === "string" ? data.password : "",
			role: typeof data.role === "string" ? data.role : undefined,
			isActive:
				typeof data.isActive === "boolean"
					? data.isActive
					: data.isActive === undefined
						? true
						: Boolean(data.isActive),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		this.data.push(record);
		return record;
	}

	async findById(id: string) {
		return this.data.find((item) => item._id === id) ?? null;
	}

	async findByEmail(email: string) {
		return this.data.find((item) => item.email === email) ?? null;
	}

	async findAll(
		skip: number,
		limit: number,
		sortBy: string = "createdAt",
		sortOrder: "asc" | "desc" = "desc",
		_filter?: unknown,
	) {
		const sorted = [...this.data].sort((a, b) => {
			const left = (a as Record<string, unknown>)[sortBy] as
				| number
				| string
				| Date
				| undefined;
			const right = (b as Record<string, unknown>)[sortBy] as
				| number
				| string
				| Date
				| undefined;
			if (left === undefined || right === undefined) return 0;
			const comparison = left > right ? 1 : left < right ? -1 : 0;
			return sortOrder === "asc" ? comparison : -comparison;
		});

		return sorted.slice(skip, skip + limit);
	}

	async count(_filter?: unknown) {
		return this.data.length;
	}

	async update(id: string, data: Record<string, unknown>) {
		const existing = await this.findById(id);
		if (!existing) return null;
		const updated = {
			...existing,
			...data,
			updatedAt: new Date(),
		};
		this.data = this.data.map((item) => (item._id === id ? updated : item));
		return updated;
	}

	async delete(id: string) {
		const existing = await this.findById(id);
		if (!existing) return null;
		this.data = this.data.filter((item) => item._id !== id);
		return existing;
	}
}

class InMemoryRoleRepository {
	private roles = new Set<string>();

	addRole(id: string) {
		this.roles.add(id);
	}

	async findById(id: string) {
		return this.roles.has(id) ? { _id: id } : null;
	}
}

const buildToken = (secret: string) =>
	jwt.sign(
		{
			id: "64e7e5d2f5e4a2c1b3d4e5f6",
			email: "admin@example.com",
			type: "admin",
			permissions: [
				"admin.create",
				"admin.read",
				"admin.update",
				"admin.delete",
			],
		},
		secret,
	);

let AdminServiceClass: typeof AdminService;
let AdminControllerClass: typeof AdminController;
let createAdminRouterFn: typeof createAdminRouter;
let errorHandlerMiddleware: typeof errorHandler;

before(async () => {
	process.env.NODE_ENV = "test";
	process.env.JWT_SECRET = process.env.JWT_SECRET || "integration-secret";
	// Required by env schema, even though tests use in-memory repositories
	process.env.MONGODB_URI =
		process.env.MONGODB_URI || "mongodb://localhost:27017/test-db";

	const servicesModule = await import("../../src/services/admin.service");
	AdminServiceClass = servicesModule.AdminService;

	const controllerModule = await import("../../src/controllers/admin.controller");
	AdminControllerClass = controllerModule.AdminController;

	const routesModule = await import("../../src/routes/admin.routes");
	createAdminRouterFn = routesModule.createAdminRouter;

	const errorModule = await import("../../src/middleware/error.middleware");
	errorHandlerMiddleware = errorModule.errorHandler;
});

const buildApp = () => {
	const adminRepository = new InMemoryAdminRepository();
	const roleRepository = new InMemoryRoleRepository();
	const adminService = new AdminServiceClass(adminRepository, roleRepository);
	const controller = new AdminControllerClass(adminService);

	const app: Application = express();
	app.use(express.json());
	app.use("/api/v1/admins", createAdminRouterFn(controller));
	app.use(errorHandlerMiddleware);

	return { app, adminRepository };
};

describe("Admin routes (integration)", () => {
	let token: string;
	let appContext: { app: Application; adminRepository: InMemoryAdminRepository };

	beforeEach(() => {
		appContext = buildApp();
		token = buildToken(process.env.JWT_SECRET || "integration-secret");
	});

	it("creates an admin successfully", async () => {
		const response = await supertest(appContext.app)
			.post("/api/v1/admins")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Test Admin",
				email: "testadmin@example.com",
				password: "password123",
				isActive: true,
			})
			.expect(201);

		assert.equal(response.body.success, true);
		assert.equal(response.body.data.email, "testadmin@example.com");
	});

	it("retrieves a list of admins", async () => {
		await supertest(appContext.app)
			.post("/api/v1/admins")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "List Admin",
				email: "listadmin@example.com",
				password: "password123",
			})
			.expect(201);

		const response = await supertest(appContext.app)
			.get("/api/v1/admins")
			.set("Authorization", `Bearer ${token}`)
			.expect(200);

		assert.equal(response.body.success, true);
		assert.ok(Array.isArray(response.body.data.items));
		assert.equal(response.body.data.items.length, 1);
		assert.ok(response.body.data.pagination);
	});

	it("retrieves an admin by id", async () => {
		const created = await supertest(appContext.app)
			.post("/api/v1/admins")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Fetch Admin",
				email: "fetch@example.com",
				password: "password123",
			})
			.expect(201);

		const adminId = (created.body.data as { _id: string })._id;
		const response = await supertest(appContext.app)
			.get(`/api/v1/admins/${adminId}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(200);

		assert.equal(response.body.data.email, "fetch@example.com");
	});

	it("updates an admin record", async () => {
		const created = await supertest(appContext.app)
			.post("/api/v1/admins")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Update Admin",
				email: "update@example.com",
				password: "password123",
				isActive: true,
			})
			.expect(201);

		const adminId = (created.body.data as { _id: string })._id;
		const response = await supertest(appContext.app)
			.put(`/api/v1/admins/${adminId}`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Updated Name",
				isActive: false,
			})
			.expect(200);

		assert.equal(response.body.data.name, "Updated Name");
		assert.equal(response.body.data.isActive, false);
	});

	it("deletes an admin", async () => {
		const created = await supertest(appContext.app)
			.post("/api/v1/admins")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Delete Admin",
				email: "delete@example.com",
				password: "password123",
			})
			.expect(201);

		const adminId = (created.body.data as { _id: string })._id;
		await supertest(appContext.app)
			.delete(`/api/v1/admins/${adminId}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(200);

		await supertest(appContext.app)
			.get(`/api/v1/admins/${adminId}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(404);
	});
});
