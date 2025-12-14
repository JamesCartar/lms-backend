import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { sendSuccessResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { getPaginationParams, calculatePaginationMeta } from '../utils/pagination.util';
import { getIdParam } from '../utils/params.util';

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
    const admin = await this.service.getAdminById(getIdParam(req));
    sendSuccessResponse(res, admin);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req);
    const { admins, total } = await this.service.getAllAdmins(page, limit, sortBy, sortOrder);
    const pagination = calculatePaginationMeta(page, limit, total);
    sendSuccessResponse(res, admins, 'Admins retrieved successfully', 200, pagination);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const admin = await this.service.updateAdmin(getIdParam(req), req.body);
    sendSuccessResponse(res, admin, 'Admin updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteAdmin(getIdParam(req));
    sendSuccessResponse(res, null, 'Admin deleted successfully');
  });
}
