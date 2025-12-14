import { PermissionRepository } from '../repositories/permission.repository';
import { PermissionCreateInput, PermissionUpdateInput } from '../models/permission.model';
import { NotFoundError, ConflictError } from '../utils/errors.util';
import { calculateSkip } from '../utils/pagination.util';

/**
 * Permission Service - Business logic layer for Permission
 */
export class PermissionService {
  private repository: PermissionRepository;

  constructor() {
    this.repository = new PermissionRepository();
  }

  async createPermission(data: PermissionCreateInput) {
    // PermissionCreateSchema validation ensures required fields are present
    const existing = await this.repository.findByName(data.name!);
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

  async getAllPermissions(
    page: number = 1,
    limit: number = 10,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ) {
    const skip = calculateSkip(page, limit);
    const permissions = await this.repository.findAll(skip, limit, sortBy, sortOrder);
    const total = await this.repository.count();
    return { permissions, total };
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
