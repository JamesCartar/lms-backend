import type { Ref } from "@typegoose/typegoose";
import type { Admin, AdminCreateInput, AdminUpdateInput } from "../models/admin.model";
import type { Role } from "../models/role.model";
import { AdminRepository } from "../repositories/admin.repository";
import { RoleRepository } from "../repositories/role.repository";
import { ConflictError, NotFoundError } from "../utils/errors.util";
import type { MongoFilter } from "../utils/filter.util";
import { calculateSkip } from "../utils/pagination.util";

type AdminRecord = {
	_id: { toString: () => string } | string;
	name?: string;
	email?: string;
	password?: string;
	role?: Ref<Role> | string;
	isActive?: boolean;
};

/**
 * Admin Service - Business logic layer for Admin
 */
export type AdminRepositoryContract = {
	create: (data: Partial<Admin>) => Promise<AdminRecord>;
	findByEmail: (email: string) => Promise<AdminRecord | null>;
	findById: (id: string) => Promise<AdminRecord | null>;
	findAll: (
		skip: number,
		limit: number,
		sortBy?: string,
		sortOrder?: "asc" | "desc",
		filter?: MongoFilter,
	) => Promise<AdminRecord[]>;
	count: (filter?: MongoFilter) => Promise<number>;
	update: (id: string, data: Partial<Admin>) => Promise<AdminRecord | null>;
	delete: (id: string) => Promise<AdminRecord | null>;
};

export type RoleRepositoryContract = {
	findById: (id: string) => Promise<unknown | null>;
};

export class AdminService {
	private repository: AdminRepositoryContract;
	private roleRepository: RoleRepositoryContract;

	constructor(
		repository: AdminRepositoryContract = new AdminRepository(),
		roleRepository: RoleRepositoryContract = new RoleRepository(),
	) {
		this.repository = repository;
		this.roleRepository = roleRepository;
	}

	async createAdmin(data: AdminCreateInput): Promise<AdminRecord> {
		// AdminCreateSchema validation ensures required fields are present
		const existing = await this.repository.findByEmail(data.email);
		if (existing) {
			throw new ConflictError("Admin with this email already exists");
		}

		// Validate role if provided
		if (data.role) {
			const role = await this.roleRepository.findById(data.role);
			if (!role) {
				throw new NotFoundError("Role not found");
			}
		}

		// In production, password should be hashed here
		return await this.repository.create({
			name: data.name,
			email: data.email,
			password: data.password,
			// Zod validates as string (ObjectId), which is valid for Mongoose references
			role: data.role as Ref<Role> | undefined,
			isActive: data.isActive,
		});
	}

	async getAdminById(id: string): Promise<AdminRecord> {
		const admin = await this.repository.findById(id);
		if (!admin) {
			throw new NotFoundError("Admin not found");
		}
		return admin;
	}

	async getAllAdmins(
		page: number = 1,
		limit: number = 10,
		sortBy?: string,
		sortOrder?: "asc" | "desc",
		filter: MongoFilter = {},
	): Promise<{ admins: AdminRecord[]; total: number }> {
		const skip = calculateSkip(page, limit);
		const admins = await this.repository.findAll(
			skip,
			limit,
			sortBy,
			sortOrder,
			filter,
		);
		const total = await this.repository.count(filter);
		return { admins, total };
	}

	async updateAdmin(id: string, data: AdminUpdateInput): Promise<AdminRecord> {
		if (data.email) {
			const existing = await this.repository.findByEmail(data.email);
			if (existing && existing._id.toString() !== id) {
				throw new ConflictError("Admin with this email already exists");
			}
		}

		// Validate role if provided
		if (data.role) {
			const role = await this.roleRepository.findById(data.role);
			if (!role) {
				throw new NotFoundError("Role not found");
			}
		}

		// In production, password should be hashed here if provided
		const admin = await this.repository.update(id, {
			name: data.name,
			email: data.email,
			password: data.password,
			// Zod validates as string (ObjectId), which is valid for Mongoose references
			role: data.role as Ref<Role> | undefined,
			isActive: data.isActive,
		});
		if (!admin) {
			throw new NotFoundError("Admin not found");
		}
		return admin;
	}

	async deleteAdmin(id: string): Promise<AdminRecord> {
		const admin = await this.repository.delete(id);
		if (!admin) {
			throw new NotFoundError("Admin not found");
		}
		return admin;
	}
}
