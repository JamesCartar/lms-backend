import { PermissionModel, Permission } from '../models/permission.model';
import { DocumentType } from '@typegoose/typegoose';

/**
 * Permission Repository - Data access layer for Permission
 */
export class PermissionRepository {
  async create(data: Partial<Permission>): Promise<DocumentType<Permission>> {
    return await PermissionModel.create(data);
  }

  async findById(id: string): Promise<DocumentType<Permission> | null> {
    return await PermissionModel.findById(id);
  }

  async findByName(name: string): Promise<DocumentType<Permission> | null> {
    return await PermissionModel.findOne({ name });
  }

  async findAll(
    skip: number,
    limit: number,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<DocumentType<Permission>[]> {
    const sortObj: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };
    
    return await PermissionModel.find()
      .sort(sortObj)
      .skip(skip)
      .limit(limit);
  }

  async count(): Promise<number> {
    return await PermissionModel.countDocuments();
  }

  async update(id: string, data: Partial<Permission>): Promise<DocumentType<Permission> | null> {
    return await PermissionModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<DocumentType<Permission> | null> {
    return await PermissionModel.findByIdAndDelete(id);
  }

  async findByIds(ids: string[]): Promise<DocumentType<Permission>[]> {
    return await PermissionModel.find({ _id: { $in: ids } });
  }
}
