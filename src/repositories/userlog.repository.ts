import type { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { type UserLog, UserLogModel } from "../models/userlog.model";
import type { MongoFilter } from "../utils/filter.util";

/**
 * UserLog Repository - Data access layer for UserLog
 */
export class UserLogRepository {
	async create(data: Partial<UserLog>): Promise<DocumentType<UserLog>> {
		return await UserLogModel.create(data);
	}

	async findById(id: string): Promise<DocumentType<UserLog> | null> {
		return await UserLogModel.findById(id);
	}

	async findAll(
		skip: number,
		limit: number,
		sortBy: string = "loginTime",
		sortOrder: "asc" | "desc" = "desc",
		filter: MongoFilter = {},
	): Promise<DocumentType<UserLog>[]> {
		const sortObj: Record<string, 1 | -1> = {
			[sortBy]: sortOrder === "asc" ? 1 : -1,
		};

		return await UserLogModel.find(filter)
			.sort(sortObj)
			.skip(skip)
			.limit(limit);
	}

	async count(filter: MongoFilter = {}): Promise<number> {
		return await UserLogModel.countDocuments(filter);
	}

	async findByUserId(
		userId: string,
		skip: number,
		limit: number,
	): Promise<DocumentType<UserLog>[]> {
		return await UserLogModel.find({ userId: new Types.ObjectId(userId) })
			.sort({ loginTime: -1 })
			.skip(skip)
			.limit(limit);
	}

	async countByUserId(userId: string): Promise<number> {
		return await UserLogModel.countDocuments({
			userId: new Types.ObjectId(userId),
		});
	}

	async deleteAll(): Promise<number> {
		const result = await UserLogModel.deleteMany({});
		return result.deletedCount || 0;
	}

	async deleteByUserId(userId: string): Promise<number> {
		const result = await UserLogModel.deleteMany({
			userId: new Types.ObjectId(userId),
		});
		return result.deletedCount || 0;
	}

	async deleteById(id: string): Promise<DocumentType<UserLog> | null> {
		return await UserLogModel.findByIdAndDelete(id);
	}
}
