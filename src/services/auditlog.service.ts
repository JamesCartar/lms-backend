import { Types } from "mongoose";
import { AuditLogRepository } from "../repositories/auditlog.repository";
import { NotFoundError } from "../utils/errors.util";
import type { MongoFilter } from "../utils/filter.util";
import { calculateSkip } from "../utils/pagination.util";

/**
 * AuditLog Service - Business logic layer for AuditLog
 */
export class AuditLogService {
	private repository: AuditLogRepository;

	constructor() {
		this.repository = new AuditLogRepository();
	}

	async createAuditLog(data: {
		userId: string;
		userType: "admin" | "student";
		email: string;
		action: "CREATE" | "UPDATE" | "DELETE";
		resource: string;
		resourceId?: string;
		changes?: Record<string, unknown>;
		ip?: string;
		userAgent?: string;
	}) {
		return await this.repository.create({
			userId: new Types.ObjectId(data.userId),
			userType: data.userType,
			email: data.email,
			action: data.action,
			resource: data.resource,
			resourceId: data.resourceId
				? new Types.ObjectId(data.resourceId)
				: undefined,
			changes: data.changes,
			ip: data.ip,
			userAgent: data.userAgent,
			timestamp: new Date(),
		});
	}

	async getAuditLogById(id: string) {
		const log = await this.repository.findById(id);
		if (!log) {
			throw new NotFoundError("Audit log not found");
		}
		return log;
	}

	async getAllAuditLogs(
		page: number,
		limit: number,
		sortBy?: string,
		sortOrder?: "asc" | "desc",
		filter: MongoFilter = {},
	) {
		const skip = calculateSkip(page, limit);
		const logs = await this.repository.findAll(
			skip,
			limit,
			sortBy,
			sortOrder,
			filter,
		);
		const total = await this.repository.count(filter);
		return { logs, total };
	}

	async getAuditLogsByUserId(userId: string, page: number, limit: number) {
		const skip = calculateSkip(page, limit);
		const logs = await this.repository.findByUserId(userId, skip, limit);
		const total = await this.repository.countByUserId(userId);
		return { logs, total };
	}

	async getAuditLogsByResource(resource: string, page: number, limit: number) {
		const skip = calculateSkip(page, limit);
		const logs = await this.repository.findByResource(resource, skip, limit);
		const total = await this.repository.countByResource(resource);
		return { logs, total };
	}

	async clearAllAuditLogs() {
		const count = await this.repository.deleteAll();
		return { deletedCount: count };
	}

	async clearAuditLogsByUserId(userId: string) {
		const count = await this.repository.deleteByUserId(userId);
		return { deletedCount: count };
	}

	async deleteAuditLogById(id: string) {
		const log = await this.repository.deleteById(id);
		if (!log) {
			throw new NotFoundError("Audit log not found");
		}
		return log;
	}
}
