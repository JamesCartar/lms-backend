import type { Request, Response } from "express";
import { AuditLogService } from "../services/auditlog.service";
import { sendSuccessResponse } from "../utils/response.util";
import { asyncHandler } from "../middleware/error.middleware";
import {
	getPaginationParams,
	calculatePaginationMeta,
} from "../utils/pagination.util";
import { getIdParam, getRequiredParam } from "../utils/params.util";
import { buildAuditLogFilter } from "../filters/auditlog.filter";

/**
 * AuditLog Controller - Handles HTTP requests for AuditLog
 */
export class AuditLogController {
	private service: AuditLogService;

	constructor() {
		this.service = new AuditLogService();
	}

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, sortOrder } = getPaginationParams(req);

		// Get validated filter query from middleware
		const filterQuery = req.validatedQuery || {};
		const filter = buildAuditLogFilter(filterQuery);

		const { logs, total } = await this.service.getAllAuditLogs(
			page,
			limit,
			sortBy,
			sortOrder,
			filter,
		);
		const pagination = calculatePaginationMeta(page, limit, total);
		sendSuccessResponse(res, {
			data: logs,
			message: "Audit logs retrieved successfully",
			pagination,
		});
	});

	getById = asyncHandler(async (req: Request, res: Response) => {
		const log = await this.service.getAuditLogById(getIdParam(req));
		sendSuccessResponse(res, { data: log });
	});

	getByUserId = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit } = getPaginationParams(req);
		const { logs, total } = await this.service.getAuditLogsByUserId(
			getRequiredParam(req, "userId"),
			page,
			limit,
		);
		const pagination = calculatePaginationMeta(page, limit, total);
		sendSuccessResponse(res, {
			data: logs,
			message: "Audit logs retrieved successfully",
			pagination,
		});
	});

	getByResource = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit } = getPaginationParams(req);
		const { logs, total } = await this.service.getAuditLogsByResource(
			getRequiredParam(req, "resource"),
			page,
			limit,
		);
		const pagination = calculatePaginationMeta(page, limit, total);
		sendSuccessResponse(res, {
			data: logs,
			message: "Audit logs retrieved successfully",
			pagination,
		});
	});

	clearAll = asyncHandler(async (_req: Request, res: Response) => {
		const result = await this.service.clearAllAuditLogs();
		sendSuccessResponse(res, {
			data: result,
			message: "All audit logs cleared successfully",
		});
	});

	clearByUserId = asyncHandler(async (req: Request, res: Response) => {
		const result = await this.service.clearAuditLogsByUserId(
			getRequiredParam(req, "userId"),
		);
		sendSuccessResponse(res, {
			data: result,
			message: "Audit logs cleared successfully",
		});
	});

	deleteById = asyncHandler(async (req: Request, res: Response) => {
		await this.service.deleteAuditLogById(getIdParam(req));
		sendSuccessResponse(res, {
			data: null,
			message: "Audit log deleted successfully",
		});
	});
}
