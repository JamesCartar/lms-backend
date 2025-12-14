import { PermissionRepository } from '../repositories/permission.repository';
import { PermissionCreateInput, PermissionUpdateInput } from '../models/permission.model';

/**
 * Permission Service - Business logic layer for Permission
 */
export class PermissionService {
  private repository: PermissionRepository;

  constructor() {
    this.repository = new PermissionRepository();
  }

  async createPermission(data: PermissionCreateInput) {
    const existing = await this.repository.findByName(data.name!);
    if (existing) {
      throw new Error('Permission with this name already exists');
    }
    return await this.repository.create(data);
  }

  async getPermissionById(id: string) {
    const permission = await this.repository.findById(id);
    if (!permission) {
      throw new Error('Permission not found');
    }
    return permission;
  }

  async getAllPermissions() {
    return await this.repository.findAll();
  }

  async updatePermission(id: string, data: PermissionUpdateInput) {
    if (data.name) {
      const existing = await this.repository.findByName(data.name);
      if (existing && existing._id.toString() !== id) {
        throw new Error('Permission with this name already exists');
      }
    }
    const permission = await this.repository.update(id, data);
    if (!permission) {
      throw new Error('Permission not found');
    }
    return permission;
  }

  async deletePermission(id: string) {
    const permission = await this.repository.delete(id);
    if (!permission) {
      throw new Error('Permission not found');
    }
    return permission;
  }
}
