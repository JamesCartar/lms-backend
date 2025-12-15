import { Types } from "mongoose";
import { UserLogRepository } from "../repositories/userlog.repository";
import { NotFoundError } from "../utils/errors.util";
import type { MongoFilter } from "../utils/filter.util";
import { calculateSkip } from "../utils/pagination.util";

/**
 * UserLog Service - Business logic layer for UserLog
 */
export class UserLogService {
	private repository: UserLogRepository;

	constructor() {
		this.repository = new UserLogRepository();
	}

	async createUserLog(data: {
		userId: string;
		userType: "admin" | "student";
		email: string;
		ip?: string;
		userAgent?: string;
	}) {
		return await this.repository.create({
			userId: new Types.ObjectId(data.userId),
			userType: data.userType,
			email: data.email,
			ip: data.ip,
			userAgent: data.userAgent,
			loginTime: new Date(),
		});
	}

	async getUserLogById(id: string) {
		const log = await this.repository.findById(id);
		if (!log) {
			throw new NotFoundError("User log not found");
		}
		return log;
	}

	async getAllUserLogs(
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

	async getUserLogsByUserId(userId: string, page: number, limit: number) {
		const skip = calculateSkip(page, limit);
		const logs = await this.repository.findByUserId(userId, skip, limit);
		const total = await this.repository.countByUserId(userId);
		return { logs, total };
	}

	async clearAllUserLogs() {
		const count = await this.repository.deleteAll();
		return { deletedCount: count };
	}

	async clearUserLogsByUserId(userId: string) {
		const count = await this.repository.deleteByUserId(userId);
		return { deletedCount: count };
	}

	async deleteUserLogById(id: string) {
		const log = await this.repository.deleteById(id);
		if (!log) {
			throw new NotFoundError("User log not found");
		}
		return log;
	}
}
