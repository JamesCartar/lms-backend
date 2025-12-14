import { Request, Response } from 'express';
import { PermissionService } from '../services/permission.service';
import { sendSuccessResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { getPaginationParams, calculatePaginationMeta } from '../utils/pagination.util';

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
    sendSuccessResponse(res, permission, 'Permission created successfully', 201);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const permission = await this.service.getPermissionById(req.params.id);
    sendSuccessResponse(res, permission);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req);
    const { permissions, total } = await this.service.getAllPermissions(page, limit, sortBy, sortOrder);
    const pagination = calculatePaginationMeta(page, limit, total);
    sendSuccessResponse(res, permissions, 'Permissions retrieved successfully', 200, pagination);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const permission = await this.service.updatePermission(req.params.id, req.body);
    sendSuccessResponse(res, permission, 'Permission updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deletePermission(req.params.id);
    sendSuccessResponse(res, null, 'Permission deleted successfully');
  });
}
