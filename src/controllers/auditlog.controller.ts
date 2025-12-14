import { Request, Response } from 'express';
import { AuditLogService } from '../services/auditlog.service';
import { sendSuccessResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { getPaginationParams, calculatePaginationMeta } from '../utils/pagination.util';

/**
 * AuditLog Controller - Handles HTTP requests for AuditLog
 */
export class AuditLogController {
  private service: AuditLogService;

  constructor() {
    this.service = new AuditLogService();
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req);
    const { logs, total } = await this.service.getAllAuditLogs(page, limit, sortBy, sortOrder);
    const pagination = calculatePaginationMeta(page, limit, total);
    sendSuccessResponse(res, logs, 'Audit logs retrieved successfully', 200, pagination);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const log = await this.service.getAuditLogById(req.params.id);
    sendSuccessResponse(res, log);
  });

  getByUserId = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = getPaginationParams(req);
    const { logs, total } = await this.service.getAuditLogsByUserId(req.params.userId, page, limit);
    const pagination = calculatePaginationMeta(page, limit, total);
    sendSuccessResponse(res, logs, 'Audit logs retrieved successfully', 200, pagination);
  });

  getByResource = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = getPaginationParams(req);
    const { logs, total } = await this.service.getAuditLogsByResource(req.params.resource, page, limit);
    const pagination = calculatePaginationMeta(page, limit, total);
    sendSuccessResponse(res, logs, 'Audit logs retrieved successfully', 200, pagination);
  });

  clearAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.clearAllAuditLogs();
    sendSuccessResponse(res, result, 'All audit logs cleared successfully');
  });

  clearByUserId = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.clearAuditLogsByUserId(req.params.userId);
    sendSuccessResponse(res, result, 'Audit logs cleared successfully');
  });

  deleteById = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteAuditLogById(req.params.id);
    sendSuccessResponse(res, null, 'Audit log deleted successfully');
  });
}
