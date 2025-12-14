import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { sendSuccessResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

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
    sendSuccessResponse(res, admin, 'Admin created successfully', 201);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const admin = await this.service.getAdminById(req.params.id);
    sendSuccessResponse(res, admin);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const admins = await this.service.getAllAdmins();
    sendSuccessResponse(res, admins);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const admin = await this.service.updateAdmin(req.params.id, req.body);
    sendSuccessResponse(res, admin, 'Admin updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteAdmin(req.params.id);
    sendSuccessResponse(res, null, 'Admin deleted successfully');
  });
}
