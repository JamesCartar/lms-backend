import { RoleRepository } from '../repositories/role.repository';
import { PermissionRepository } from '../repositories/permission.repository';
import { RoleCreateInput, RoleUpdateInput } from '../models/role.model';

/**
 * Role Service - Business logic layer for Role
 */
export class RoleService {
  private repository: RoleRepository;
  private permissionRepository: PermissionRepository;

  constructor() {
    this.repository = new RoleRepository();
    this.permissionRepository = new PermissionRepository();
  }

  async createRole(data: RoleCreateInput) {
    const existing = await this.repository.findByName(data.name!);
    if (existing) {
      throw new Error('Role with this name already exists');
    }

    // Validate permissions if provided
    if (data.permissions && data.permissions.length > 0) {
      const permissions = await this.permissionRepository.findByIds(data.permissions as string[]);
      if (permissions.length !== data.permissions.length) {
        throw new Error('One or more permissions not found');
      }
    }

    return await this.repository.create(data as any);
  }

  async getRoleById(id: string) {
    const role = await this.repository.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  }

  async getAllRoles() {
    return await this.repository.findAll();
  }

  async updateRole(id: string, data: RoleUpdateInput) {
    if (data.name) {
      const existing = await this.repository.findByName(data.name);
      if (existing && existing._id.toString() !== id) {
        throw new Error('Role with this name already exists');
      }
    }

    // Validate permissions if provided
    if (data.permissions && data.permissions.length > 0) {
      const permissions = await this.permissionRepository.findByIds(data.permissions as string[]);
      if (permissions.length !== data.permissions.length) {
        throw new Error('One or more permissions not found');
      }
    }

    const role = await this.repository.update(id, data as any);
    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  }

  async deleteRole(id: string) {
    const role = await this.repository.delete(id);
    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  }
}
