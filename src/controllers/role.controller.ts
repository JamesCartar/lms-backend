import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';
import { sendSuccessResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { getPaginationParams, calculatePaginationMeta } from '../utils/pagination.util';

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
    sendSuccessResponse(res, role, 'Role created successfully', 201);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const role = await this.service.getRoleById(req.params.id);
    sendSuccessResponse(res, role);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req);
    const { roles, total } = await this.service.getAllRoles(page, limit, sortBy, sortOrder);
    const pagination = calculatePaginationMeta(page, limit, total);
    sendSuccessResponse(res, roles, 'Roles retrieved successfully', 200, pagination);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const role = await this.service.updateRole(req.params.id, req.body);
    sendSuccessResponse(res, role, 'Role updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteRole(req.params.id);
    sendSuccessResponse(res, null, 'Role deleted successfully');
  });
}
