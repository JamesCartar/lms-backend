import { RoleModel, type Role } from "../models/role.model";
import type { DocumentType } from "@typegoose/typegoose";
import type { MongoFilter } from "../utils/filter.util";

/**
 * Role Repository - Data access layer for Role
 */
export class RoleRepository {
	async create(data: Partial<Role>): Promise<DocumentType<Role>> {
		return await RoleModel.create(data);
	}

	async findById(id: string): Promise<DocumentType<Role> | null> {
		return await RoleModel.findById(id)
			.select("name description type permissions createdAt updatedAt")
			.populate({
				path: "permissions",
				select: "name resource action description",
			});
	}

	async findByName(name: string): Promise<DocumentType<Role> | null> {
		return await RoleModel.findOne({ name })
			.select("name description type permissions createdAt updatedAt")
			.populate({
				path: "permissions",
				select: "name resource action description",
			});
	}

	async findAll(
		skip: number,
		limit: number,
		sortBy: string = "createdAt",
		sortOrder: "asc" | "desc" = "desc",
		filter: MongoFilter = {},
	): Promise<DocumentType<Role>[]> {
		const sortObj: Record<string, 1 | -1> = {
			[sortBy]: sortOrder === "asc" ? 1 : -1,
		};

		return await RoleModel.find(filter)
			.select("name description type permissions createdAt updatedAt")
			.populate({
				path: "permissions",
				select: "name resource action description",
			})
			.sort(sortObj)
			.skip(skip)
			.limit(limit);
	}

	async findByIdLight(
		id: string,
	): Promise<Pick<DocumentType<Role>, "_id" | "type"> | null> {
		return await RoleModel.findById(id).select("_id type");
	}

	async findAllNames(): Promise<DocumentType<Role>[]> {
		return await RoleModel.find().select("_id name").sort({ name: 1 });
	}

	async count(filter: MongoFilter = {}): Promise<number> {
		return await RoleModel.countDocuments(filter);
	}

	async update(
		id: string,
		data: Partial<Role>,
	): Promise<DocumentType<Role> | null> {
		return await RoleModel.findByIdAndUpdate(id, data, { new: true })
			.select("name description type permissions createdAt updatedAt")
			.populate({
				path: "permissions",
				select: "name resource action description",
			});
	}

	async delete(id: string): Promise<DocumentType<Role> | null> {
		return await RoleModel.findByIdAndDelete(id);
	}
}
