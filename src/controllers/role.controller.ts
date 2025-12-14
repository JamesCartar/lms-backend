import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';
import { sendSuccessResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { getPaginationParams, calculatePaginationMeta } from '../utils/pagination.util';
import { getIdParam } from '../utils/params.util';
import { buildRoleFilter, RoleFilterQuery } from '../filters/role.filter';

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
    const role = await this.service.getRoleById(getIdParam(req));
    sendSuccessResponse(res, role);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req);
    
    // Get validated filter query from middleware
    const filterQuery = (req as any).validatedQuery as RoleFilterQuery;
    const filter = buildRoleFilter(filterQuery || {});
    
    const { roles, total } = await this.service.getAllRoles(page, limit, sortBy, sortOrder, filter);
    const pagination = calculatePaginationMeta(page, limit, total);
    sendSuccessResponse(res, roles, 'Roles retrieved successfully', 200, pagination);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const role = await this.service.updateRole(getIdParam(req), req.body);
    sendSuccessResponse(res, role, 'Role updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteRole(getIdParam(req));
    sendSuccessResponse(res, null, 'Role deleted successfully');
  });
}
