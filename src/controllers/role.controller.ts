import type { Request, Response } from "express";
import { buildRoleFilter } from "../filters/role.filter";
import { asyncHandler } from "../middleware/error.middleware";
import { RoleService } from "../services/role.service";
import {
	calculatePaginationMeta,
	getPaginationParams,
} from "../utils/pagination.util";
import { getIdParam } from "../utils/params.util";
import { sendSuccessResponse } from "../utils/response.util";

/**
 * Role Controller - Handles HTTP requests for Role
 */
export class RoleController {
	private service: RoleService;

	constructor() {
		this.service = new RoleService();
	}

	create = asyncHandler(async (req: Request, res: Response) => {
		const role = await this.service.createRole(req.body);
		sendSuccessResponse(res, {
			data: role,
			resourceKey: "role",
			message: "Role created successfully",
			statusCode: 201,
		});
	});

	getById = asyncHandler(async (req: Request, res: Response) => {
		const role = await this.service.getRoleById(getIdParam(req));
		sendSuccessResponse(res, { data: role, resourceKey: "role" });
	});

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, sortOrder } = getPaginationParams(req);

		// Get validated filter query from middleware
		const filterQuery = req.validatedQuery || {};
		const filter = buildRoleFilter(filterQuery);

		const { roles, total } = await this.service.getAllRoles(
			page,
			limit,
			sortBy,
			sortOrder,
			filter,
		);
		const pagination = calculatePaginationMeta(page, limit, total);
		sendSuccessResponse(res, {
			data: roles,
			resourceKey: "roles",
			message: "Roles retrieved successfully",
			pagination,
		});
	});

	getRoleNames = asyncHandler(async (_req: Request, res: Response) => {
		const roles = await this.service.getAllRoleNames();
		sendSuccessResponse(res, {
			data: roles,
			resourceKey: "roles",
			message: "Role names retrieved successfully",
		});
	});

	update = asyncHandler(async (req: Request, res: Response) => {
		const role = await this.service.updateRole(getIdParam(req), req.body);
		sendSuccessResponse(res, {
			data: role,
			resourceKey: "role",
			message: "Role updated successfully",
		});
	});

	delete = asyncHandler(async (req: Request, res: Response) => {
		await this.service.deleteRole(getIdParam(req));
		sendSuccessResponse(res, {
			data: null,
			message: "Role deleted successfully",
		});
	});
}
