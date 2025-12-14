import type { Request, Response } from 'express';
import { PermissionService } from '../services/permission.service';
import { sendSuccessResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { getPaginationParams, calculatePaginationMeta } from '../utils/pagination.util';
import { getIdParam } from '../utils/params.util';
import { buildPermissionFilter } from '../filters/permission.filter';

/**
 * Permission Controller - Handles HTTP requests for Permission
 */
export class PermissionController {
  private service: PermissionService;

  constructor() {
    this.service = new PermissionService();
  }

  create = asyncHandler(async (req: Request, res: Response) => {
    const permission = await this.service.createPermission(req.body);
    sendSuccessResponse(res, { data: permission, message: 'Permission created successfully', statusCode: 201 });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const permission = await this.service.getPermissionById(getIdParam(req));
    sendSuccessResponse(res, { data: permission });
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req);
    
    // Get validated filter query from middleware
    const filterQuery = req.validatedQuery || {};
    const filter = buildPermissionFilter(filterQuery);
    
    const { permissions, total } = await this.service.getAllPermissions(page, limit, sortBy, sortOrder, filter);
    const pagination = calculatePaginationMeta(page, limit, total);
    sendSuccessResponse(res, { data: permissions, message: 'Permissions retrieved successfully', pagination });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const permission = await this.service.updatePermission(getIdParam(req), req.body);
    sendSuccessResponse(res, { data: permission, message: 'Permission updated successfully' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deletePermission(getIdParam(req));
    sendSuccessResponse(res, { data: null, message: 'Permission deleted successfully' });
  });
}
