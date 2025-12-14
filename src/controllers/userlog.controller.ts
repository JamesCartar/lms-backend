import type { Request, Response } from 'express';
import { UserLogService } from '../services/userlog.service';
import { sendSuccessResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { getPaginationParams, calculatePaginationMeta } from '../utils/pagination.util';
import { getIdParam, getRequiredParam } from '../utils/params.util';
import { buildUserLogFilter } from '../filters/userlog.filter';

/**
 * UserLog Controller - Handles HTTP requests for UserLog
 */
export class UserLogController {
  private service: UserLogService;

  constructor() {
    this.service = new UserLogService();
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req);
    
    // Get validated filter query from middleware
    const filterQuery = req.validatedQuery || {};
    const filter = buildUserLogFilter(filterQuery);
    
    const { logs, total } = await this.service.getAllUserLogs(page, limit, sortBy, sortOrder, filter);
    const pagination = calculatePaginationMeta(page, limit, total);
    sendSuccessResponse(res, { data: logs, message: 'User logs retrieved successfully', pagination });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const log = await this.service.getUserLogById(getIdParam(req));
    sendSuccessResponse(res, { data: log });
  });

  getByUserId = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = getPaginationParams(req);
    const { logs, total } = await this.service.getUserLogsByUserId(getRequiredParam(req, "userId"), page, limit);
    const pagination = calculatePaginationMeta(page, limit, total);
    sendSuccessResponse(res, { data: logs, message: 'User logs retrieved successfully', pagination });
  });

  clearAll = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.service.clearAllUserLogs();
    sendSuccessResponse(res, { data: result, message: 'All user logs cleared successfully' });
  });

  clearByUserId = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.clearUserLogsByUserId(getRequiredParam(req, "userId"));
    sendSuccessResponse(res, { data: result, message: 'User logs cleared successfully' });
  });

  deleteById = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteUserLogById(getIdParam(req));
    sendSuccessResponse(res, { data: null, message: 'User log deleted successfully' });
  });
}
