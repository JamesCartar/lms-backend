import { Request, Response } from 'express';
import { UserLogService } from '../services/userlog.service';
import { sendSuccessResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { getPaginationParams, calculatePaginationMeta } from '../utils/pagination.util';
import { getIdParam, getRequiredParam } from '../utils/params.util';
import { buildUserLogFilter } from '../filters/userlog.filter';
import '../types/request.types';

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
    sendSuccessResponse(res, logs, 'User logs retrieved successfully', 200, pagination);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const log = await this.service.getUserLogById(getIdParam(req));
    sendSuccessResponse(res, log);
  });

  getByUserId = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = getPaginationParams(req);
    const { logs, total } = await this.service.getUserLogsByUserId(getRequiredParam(req, "userId"), page, limit);
    const pagination = calculatePaginationMeta(page, limit, total);
    sendSuccessResponse(res, logs, 'User logs retrieved successfully', 200, pagination);
  });

  clearAll = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.service.clearAllUserLogs();
    sendSuccessResponse(res, result, 'All user logs cleared successfully');
  });

  clearByUserId = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.clearUserLogsByUserId(getRequiredParam(req, "userId"));
    sendSuccessResponse(res, result, 'User logs cleared successfully');
  });

  deleteById = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteUserLogById(getIdParam(req));
    sendSuccessResponse(res, null, 'User log deleted successfully');
  });
}
