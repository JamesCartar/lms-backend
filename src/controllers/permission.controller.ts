import { Request, Response } from 'express';
import { PermissionService } from '../services/permission.service';
import { sendSuccessResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

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
    const permissions = await this.service.getAllPermissions();
    sendSuccessResponse(res, permissions);
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
