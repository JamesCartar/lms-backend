import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';
import { sendSuccessResponse, sendSuccessResponseWithResource } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { getPaginationParams, calculatePaginationMeta } from '../utils/pagination.util';
import { getIdParam } from '../utils/params.util';
import { buildRoleFilter } from '../filters/role.filter';

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
    sendSuccessResponseWithResource(res, role, 'role', 'Role created successfully', 201);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const role = await this.service.getRoleById(getIdParam(req));
    sendSuccessResponseWithResource(res, role, 'role');
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req);
    
    // Get validated filter query from middleware
    const filterQuery = req.validatedQuery || {};
    const filter = buildRoleFilter(filterQuery);
    
    const { roles, total } = await this.service.getAllRoles(page, limit, sortBy, sortOrder, filter);
    const pagination = calculatePaginationMeta(page, limit, total);
    sendSuccessResponseWithResource(res, roles, 'roles', 'Roles retrieved successfully', 200, pagination);
  });

  getRoleNames = asyncHandler(async (_req: Request, res: Response) => {
    const roles = await this.service.getAllRoleNames();
    sendSuccessResponseWithResource(res, roles, 'roles', 'Role names retrieved successfully');
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const role = await this.service.updateRole(getIdParam(req), req.body);
    sendSuccessResponseWithResource(res, role, 'role', 'Role updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteRole(getIdParam(req));
    sendSuccessResponse(res, null, 'Role deleted successfully');
  });
}
