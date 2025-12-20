import type { DocumentType } from "@typegoose/typegoose";
import { type Admin, AdminModel } from "../models/admin.model";
import type { MongoFilter } from "../utils/filter.util";

/**
 * Admin Repository - Data access layer for Admin
 */
export class AdminRepository {
	async create(data: Partial<Admin>): Promise<DocumentType<Admin>> {
		return await AdminModel.create(data);
	}

	async findById(id: string): Promise<DocumentType<Admin> | null> {
		return await AdminModel.findById(id).populate({
			path: "role",
			select: "name description type",
		});
	}

	async findByEmail(email: string): Promise<DocumentType<Admin> | null> {
		return await AdminModel.findOne({ email }).populate({
			path: "role",
			select: "name description type",
		});
	}

	async findByEmailWithPermissions(
		email: string,
	): Promise<DocumentType<Admin> | null> {
		return await AdminModel.findOne({ email }).populate({
			path: "role",
			select: "name description type permissions",
			populate: {
				path: "permissions",
				select: "name resource action description",
			},
		});
	}

	async findByIdWithPermissions(
		id: string,
	): Promise<DocumentType<Admin> | null> {
		return await AdminModel.findById(id)
			.select("-password")
			.populate({
				path: "role",
				select: "name description type permissions",
				populate: {
					path: "permissions",
					select: "name resource action description",
				},
			});
	}

	async findAll(
		skip: number,
		limit: number,
		sortBy: string = "createdAt",
		sortOrder: "asc" | "desc" = "desc",
		filter: MongoFilter = {},
	): Promise<DocumentType<Admin>[]> {
		const sortObj: Record<string, 1 | -1> = {
			[sortBy]: sortOrder === "asc" ? 1 : -1,
		};

		return await AdminModel.find(filter)
			.populate({
				path: "role",
				select: "name description type",
			})
			.sort(sortObj)
			.skip(skip)
			.limit(limit);
	}

	async count(filter: MongoFilter = {}): Promise<number> {
		return await AdminModel.countDocuments(filter);
	}

	async update(
		id: string,
		data: Partial<Admin>,
	): Promise<DocumentType<Admin> | null> {
		return await AdminModel.findByIdAndUpdate(id, data, { new: true }).populate(
			{
				path: "role",
				select: "name description type",
			},
		);
	}

	async delete(id: string): Promise<DocumentType<Admin> | null> {
		return await AdminModel.findByIdAndDelete(id);
	}
}
