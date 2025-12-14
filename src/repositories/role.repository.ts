import { RoleModel, Role } from '../models/role.model';
import { DocumentType } from '@typegoose/typegoose';

/**
 * Role Repository - Data access layer for Role
 */
export class RoleRepository {
  async create(data: Partial<Role>): Promise<DocumentType<Role>> {
    return await RoleModel.create(data);
  }

  async findById(id: string): Promise<DocumentType<Role> | null> {
    return await RoleModel.findById(id).populate('permissions');
  }

  async findByName(name: string): Promise<DocumentType<Role> | null> {
    return await RoleModel.findOne({ name }).populate('permissions');
  }

  async findAll(): Promise<DocumentType<Role>[]> {
    return await RoleModel.find().populate('permissions');
  }

  async update(id: string, data: Partial<Role>): Promise<DocumentType<Role> | null> {
    return await RoleModel.findByIdAndUpdate(id, data, { new: true }).populate('permissions');
  }

  async delete(id: string): Promise<DocumentType<Role> | null> {
    return await RoleModel.findByIdAndDelete(id);
  }
}
