import type { DocumentType } from "@typegoose/typegoose";
import type { FilterQuery } from "mongoose";
import { Types } from "mongoose";
import { type AuditLog, AuditLogModel } from "../models/auditlog.model";

/**
 * AuditLog Repository - Data access layer for AuditLog
 */
export class AuditLogRepository {
	async create(data: Partial<AuditLog>): Promise<DocumentType<AuditLog>> {
		return await AuditLogModel.create(data);
	}

	async findById(id: string): Promise<DocumentType<AuditLog> | null> {
		return await AuditLogModel.findById(id);
	}

	async findAll(
		skip: number,
		limit: number,
		sortBy = "timestamp",
		sortOrder: "asc" | "desc" = "desc",
		filter: FilterQuery<AuditLog> = {},
	): Promise<DocumentType<AuditLog>[]> {
		const sortObj: Record<string, 1 | -1> = {
			[sortBy]: sortOrder === "asc" ? 1 : -1,
		};

		return await AuditLogModel.find(filter)
			.sort(sortObj)
			.skip(skip)
			.limit(limit);
	}

	async count(filter: FilterQuery<AuditLog> = {}): Promise<number> {
		return await AuditLogModel.countDocuments(filter);
	}

	async findByUserId(
		userId: string,
		skip: number,
		limit: number,
	): Promise<DocumentType<AuditLog>[]> {
		return await AuditLogModel.find({ userId: new Types.ObjectId(userId) })
			.sort({ timestamp: -1 })
			.skip(skip)
			.limit(limit);
	}

	async countByUserId(userId: string): Promise<number> {
		return await AuditLogModel.countDocuments({
			userId: new Types.ObjectId(userId),
		});
	}

	async findByResource(
		resource: string,
		skip: number,
		limit: number,
	): Promise<DocumentType<AuditLog>[]> {
		return await AuditLogModel.find({ resource })
			.sort({ timestamp: -1 })
			.skip(skip)
			.limit(limit);
	}

	async countByResource(resource: string): Promise<number> {
		return await AuditLogModel.countDocuments({ resource });
	}

	async deleteAll(): Promise<number> {
		const result = await AuditLogModel.deleteMany({});
		return result.deletedCount || 0;
	}

	async deleteByUserId(userId: string): Promise<number> {
		const result = await AuditLogModel.deleteMany({
			userId: new Types.ObjectId(userId),
		});
		return result.deletedCount || 0;
	}

	async deleteById(id: string): Promise<DocumentType<AuditLog> | null> {
		return await AuditLogModel.findByIdAndDelete(id);
	}
}
