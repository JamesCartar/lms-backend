import { PermissionRepository } from '../repositories/permission.repository';
import { PermissionCreateInput, PermissionUpdateInput } from '../models/permission.model';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors.util';

/**
 * Permission Service - Business logic layer for Permission
 */
export class PermissionService {
  private repository: PermissionRepository;

  constructor() {
    this.repository = new PermissionRepository();
  }

  async createPermission(data: PermissionCreateInput) {
    // Validation ensures name exists, but TypeScript doesn't know that
    if (!data.name || !data.resource || !data.action) {
      throw new BadRequestError('Name, resource, and action are required');
    }
    
    const existing = await this.repository.findByName(data.name);
    if (existing) {
      throw new ConflictError('Permission with this name already exists');
    }
    return await this.repository.create(data);
  }

  async getPermissionById(id: string) {
    const permission = await this.repository.findById(id);
    if (!permission) {
      throw new NotFoundError('Permission not found');
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
        throw new ConflictError('Permission with this name already exists');
      }
    }
    const permission = await this.repository.update(id, data);
    if (!permission) {
      throw new NotFoundError('Permission not found');
    }
    return permission;
  }

  async deletePermission(id: string) {
    const permission = await this.repository.delete(id);
    if (!permission) {
      throw new NotFoundError('Permission not found');
    }
    return permission;
  }
}
