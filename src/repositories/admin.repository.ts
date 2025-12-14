import type { DocumentType } from "@typegoose/typegoose";
import type { FilterQuery } from "mongoose";
import { type Admin, AdminModel } from "../models/admin.model";

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

	async findAll(
		skip: number,
		limit: number,
		sortBy = "createdAt",
		sortOrder: "asc" | "desc" = "desc",
		filter: FilterQuery<Admin> = {},
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

	async count(filter: FilterQuery<Admin> = {}): Promise<number> {
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
