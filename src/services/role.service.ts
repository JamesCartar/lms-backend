import type { Ref } from "@typegoose/typegoose";
import type { Permission } from "../db/models/permission.model";
import type { RoleCreateInput, RoleUpdateInput } from "../db/models/role.model";
import { PermissionRepository } from "../repositories/permission.repository";
import { RoleRepository } from "../repositories/role.repository";
import {
	BadRequestError,
	ConflictError,
	NotFoundError,
} from "../utils/errors.util";
import type { MongoFilter } from "../utils/filter.util";
import { calculateSkip } from "../utils/pagination.util";

/**
 * Role Service - Business logic layer for Role
 */
export class RoleService {
	private repository: RoleRepository;
	private permissionRepository: PermissionRepository;

	constructor() {
		this.repository = new RoleRepository();
		this.permissionRepository = new PermissionRepository();
	}

	async createRole(data: RoleCreateInput) {
		// RoleCreateSchema validation ensures required fields are present
		const existing = await this.repository.findByName(data.name);
		if (existing) {
			throw new ConflictError("Role with this name already exists");
		}

		// Validate permissions if provided
		if (data.permissions && data.permissions.length > 0) {
			const permissions = await this.permissionRepository.findByIds(
				data.permissions as string[],
			);
			if (permissions.length !== data.permissions.length) {
				throw new NotFoundError("One or more permissions not found");
			}
		}

		return await this.repository.create({
			name: data.name,
			description: data.description,
			type: data.type,
			// Zod validates as string[] (ObjectIds), which is valid for Mongoose references
			permissions: data.permissions as Ref<Permission>[] | undefined,
		});
	}

	async getRoleById(id: string) {
		const role = await this.repository.findById(id);
		if (!role) {
			throw new NotFoundError("Role not found");
		}
		return role;
	}

	async getAllRoles(
		page: number = 1,
		limit: number = 10,
		sortBy?: string,
		sortOrder?: "asc" | "desc",
		filter: MongoFilter = {},
	) {
		const skip = calculateSkip(page, limit);
		const roles = await this.repository.findAll(
			skip,
			limit,
			sortBy,
			sortOrder,
			filter,
		);
		const total = await this.repository.count(filter);
		return { roles, total };
	}

	async getAllRoleNames() {
		const roles = await this.repository.findAllNames();
		return roles;
	}

	async updateRole(id: string, data: RoleUpdateInput) {
		if (data.name) {
			const existing = await this.repository.findByName(data.name);
			if (existing && existing._id.toString() !== id) {
				throw new ConflictError("Role with this name already exists");
			}
		}

		// Validate permissions if provided
		if (data.permissions && data.permissions.length > 0) {
			const permissions = await this.permissionRepository.findByIds(
				data.permissions as string[],
			);
			if (permissions.length !== data.permissions.length) {
				throw new NotFoundError("One or more permissions not found");
			}
		}

		const role = await this.repository.update(id, {
			name: data.name,
			description: data.description,
			type: data.type,
			// Zod validates as string[] (ObjectIds), which is valid for Mongoose references
			permissions: data.permissions as Ref<Permission>[] | undefined,
		});
		if (!role) {
			throw new NotFoundError("Role not found");
		}
		return role;
	}

	async deleteRole(id: string) {
		// Use lighter query to check role existence and type
		const role = await this.repository.findByIdLight(id);
		if (!role) {
			throw new NotFoundError("Role not found");
		}

		// Prevent deletion of system roles
		if (role.type === "system") {
			throw new BadRequestError("System roles cannot be deleted");
		}

		const deletedRole = await this.repository.delete(id);
		return deletedRole;
	}
}
