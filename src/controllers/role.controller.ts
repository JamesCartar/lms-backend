import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';
import { sendSuccessResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

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
    const roles = await this.service.getAllRoles();
    sendSuccessResponse(res, roles);
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
