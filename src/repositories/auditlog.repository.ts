import { AuditLogModel, AuditLog } from '../models/auditlog.model';
import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';

/**
 * AuditLog Repository - Data access layer for AuditLog
 */
export class AuditLogRepository {
  async create(data: Partial<AuditLog>): Promise<DocumentType<AuditLog>> {
    return await AuditLogModel.create(data);
  }

  async findById(id: string): Promise<DocumentType<AuditLog> | null> {
    return await AuditLogModel.findById(id);
  }

  async findAll(
    skip: number,
    limit: number,
    sortBy: string = 'timestamp',
    sortOrder: 'asc' | 'desc' = 'desc',
    filter: Record<string, any> = {}
  ): Promise<DocumentType<AuditLog>[]> {
    const sortObj: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };
    
    return await AuditLogModel.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);
  }

  async count(filter: Record<string, any> = {}): Promise<number> {
    return await AuditLogModel.countDocuments(filter);
  }

  async findByUserId(
    userId: string,
    skip: number,
    limit: number
  ): Promise<DocumentType<AuditLog>[]> {
    return await AuditLogModel.find({ userId: new Types.ObjectId(userId) })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countByUserId(userId: string): Promise<number> {
    return await AuditLogModel.countDocuments({ userId: new Types.ObjectId(userId) });
  }

  async findByResource(
    resource: string,
    skip: number,
    limit: number
  ): Promise<DocumentType<AuditLog>[]> {
    return await AuditLogModel.find({ resource })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countByResource(resource: string): Promise<number> {
    return await AuditLogModel.countDocuments({ resource });
  }

  async deleteAll(): Promise<number> {
    const result = await AuditLogModel.deleteMany({});
    return result.deletedCount || 0;
  }

  async deleteByUserId(userId: string): Promise<number> {
    const result = await AuditLogModel.deleteMany({ userId: new Types.ObjectId(userId) });
    return result.deletedCount || 0;
  }

  async deleteById(id: string): Promise<DocumentType<AuditLog> | null> {
    return await AuditLogModel.findByIdAndDelete(id);
  }
}
