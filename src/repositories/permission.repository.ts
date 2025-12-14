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

  async findAll(): Promise<DocumentType<Permission>[]> {
    return await PermissionModel.find();
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
