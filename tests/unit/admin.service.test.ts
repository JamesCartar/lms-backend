import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { AdminService } from "../../src/services/admin.service";
import { ConflictError, NotFoundError } from "../../src/utils/errors.util";

type AdminRecord = {
	_id: { toString: () => string };
	name?: string;
	email?: string;
	password?: string;
	role?: string;
	isActive?: boolean;
};

class FakeAdminRepository {
	private data = new Map<string, AdminRecord>();

	async create(data: Record<string, unknown>) {
		const id = (this.data.size + 1).toString().padStart(24, "0");
		let isActive: boolean | undefined;
		if (typeof data.isActive === "boolean") {
			isActive = data.isActive;
		} else if (data.isActive !== undefined) {
			isActive = Boolean(data.isActive);
		}
		const record: AdminRecord = {
			_id: { toString: () => id },
			name: typeof data.name === "string" ? data.name : "",
			email: typeof data.email === "string" ? data.email : "",
			password: typeof data.password === "string" ? data.password : "",
			role: typeof data.role === "string" ? data.role : undefined,
			isActive,
		};
		this.data.set(id, record);
		return record;
	}

	async findByEmail(email: string) {
		for (const value of this.data.values()) {
			if (value.email === email) {
				return value;
			}
		}
		return null;
	}

	async findById(id: string) {
		return this.data.get(id) ?? null;
	}

	async findAll() {
		return Array.from(this.data.values());
	}

	async count(_filter?: unknown) {
		return this.data.size;
	}

	async update(id: string, data: Record<string, unknown>) {
		const existing = this.data.get(id);
		if (!existing) return null;
		const updated = { ...existing, ...data };
		this.data.set(id, updated);
		return updated;
	}

	async delete(id: string) {
		const existing = this.data.get(id);
		if (!existing) return null;
		this.data.delete(id);
		return existing;
	}
}

class FakeRoleRepository {
	constructor(private readonly validRoles = new Set<string>()) {}

	addRole(id: string) {
		this.validRoles.add(id);
	}

	async findById(id: string) {
		return this.validRoles.has(id)
			? { _id: { toString: () => id } }
			: null;
	}
}

describe("AdminService (unit)", () => {
	let adminRepository: FakeAdminRepository;
	let roleRepository: FakeRoleRepository;
	let service: AdminService;

	beforeEach(() => {
		adminRepository = new FakeAdminRepository();
		roleRepository = new FakeRoleRepository();
		service = new AdminService(adminRepository, roleRepository);
	});

	it("creates an admin when email is unique", async () => {
		const admin = await service.createAdmin({
			name: "Jane Doe",
			email: "jane@example.com",
			password: "password123",
			isActive: true,
		});

		assert.equal(admin.email, "jane@example.com");
		assert.equal(admin.name, "Jane Doe");
	});

	it("throws a conflict error when email already exists", async () => {
		await adminRepository.create({
			name: "Existing",
			email: "dup@example.com",
			password: "password123",
		});

		await assert.rejects(
			() =>
				service.createAdmin({
					name: "Another",
					email: "dup@example.com",
					password: "password123",
				}),
			(error: unknown) => error instanceof ConflictError,
		);
	});

	it("throws not found when role does not exist on create", async () => {
		await assert.rejects(
			() =>
				service.createAdmin({
					name: "No Role",
					email: "norole@example.com",
					password: "password123",
					role: "64e7e5d2f5e4a2c1b3d4e5f6",
				}),
			(error: unknown) => error instanceof NotFoundError,
		);
	});

	it("throws conflict error when updating to duplicate email", async () => {
		const existing = await adminRepository.create({
			name: "Existing",
			email: "existing@example.com",
			password: "password123",
		});
		await adminRepository.create({
			name: "Other",
			email: "other@example.com",
			password: "password123",
		});

		await assert.rejects(
			() =>
				service.updateAdmin(existing._id.toString(), {
					email: "other@example.com",
				}),
			(error: unknown) => error instanceof ConflictError,
		);
	});

	it("throws not found when updating non-existent admin", async () => {
		await assert.rejects(
			() =>
				service.updateAdmin("64e7e5d2f5e4a2c1b3d4e5f6", {
					name: "Missing",
				}),
			(error: unknown) => error instanceof NotFoundError,
		);
	});
});
