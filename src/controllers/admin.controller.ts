import type { Request, Response } from "express";
import { buildAdminFilter } from "../filters/admin.filter";
import { asyncHandler } from "../middleware/error.middleware";
import { AdminService } from "../services/admin.service";
import {
	calculatePaginationMeta,
	getPaginationParams,
} from "../utils/pagination.util";
import { getIdParam } from "../utils/params.util";
import { sendSuccessResponse } from "../utils/response.util";

/**
 * Admin Controller - Handles HTTP requests for Admin
 */
export class AdminController {
	private service: AdminService;

	constructor() {
		this.service = new AdminService();
	}

	create = asyncHandler(async (req: Request, res: Response) => {
		const admin = await this.service.createAdmin(req.body);
		sendSuccessResponse(res, {
			data: admin,
			message: "Admin created successfully",
			statusCode: 201,
		});
	});

	getById = asyncHandler(async (req: Request, res: Response) => {
		const admin = await this.service.getAdminById(getIdParam(req));
		sendSuccessResponse(res, { data: admin });
	});

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, sortOrder } = getPaginationParams(req);

		// Get validated filter query from middleware
		const filterQuery = req.validatedQuery || {};
		const filter = buildAdminFilter(filterQuery);

		const { admins, total } = await this.service.getAllAdmins(
			page,
			limit,
			sortBy,
			sortOrder,
			filter,
		);
		const pagination = calculatePaginationMeta(page, limit, total);
		sendSuccessResponse(res, {
			data: admins,
			message: "Admins retrieved successfully",
			pagination,
		});
	});

	update = asyncHandler(async (req: Request, res: Response) => {
		const admin = await this.service.updateAdmin(getIdParam(req), req.body);
		sendSuccessResponse(res, {
			data: admin,
			message: "Admin updated successfully",
		});
	});

	delete = asyncHandler(async (req: Request, res: Response) => {
		await this.service.deleteAdmin(getIdParam(req));
		sendSuccessResponse(res, {
			data: null,
			message: "Admin deleted successfully",
		});
	});

	changePassword = asyncHandler(async (req: Request, res: Response) => {
		const adminId = req.jwt?.id;
		if (!adminId) {
			throw new Error("Unauthorized");
		}
		await this.service.changePassword(adminId, req.body);
		sendSuccessResponse(res, {
			data: null,
			message: "Password changed successfully",
		});
	});
}
