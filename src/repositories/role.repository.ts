import type { DocumentType } from "@typegoose/typegoose";
import type { FilterQuery } from "mongoose";
import { type Role, RoleModel } from "../models/role.model";

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
		sortBy = "createdAt",
		sortOrder: "asc" | "desc" = "desc",
		filter: FilterQuery<Role> = {},
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
	): Promise<{ _id: unknown; type?: string } | null> {
		return (await RoleModel.findById(id).select("_id type").lean()) as {
			_id: unknown;
			type?: string;
		} | null;
	}

	async findAllNames(): Promise<{ _id: unknown; name: string }[]> {
		return (await RoleModel.find()
			.select("_id name")
			.sort({ name: 1 })
			.lean()) as {
			_id: unknown;
			name: string;
		}[];
	}

	async count(filter: FilterQuery<Role> = {}): Promise<number> {
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
