import { AdminRepository } from '../repositories/admin.repository';
import { RoleRepository } from '../repositories/role.repository';
import { AdminCreateInput, AdminUpdateInput } from '../models/admin.model';

/**
 * Admin Service - Business logic layer for Admin
 */
export class AdminService {
  private repository: AdminRepository;
  private roleRepository: RoleRepository;

  constructor() {
    this.repository = new AdminRepository();
    this.roleRepository = new RoleRepository();
  }

  async createAdmin(data: AdminCreateInput) {
    const existing = await this.repository.findByEmail(data.email!);
    if (existing) {
      throw new Error('Admin with this email already exists');
    }

    // Validate role if provided
    if (data.role) {
      const role = await this.roleRepository.findById(data.role);
      if (!role) {
        throw new Error('Role not found');
      }
    }

    // In production, password should be hashed here
    return await this.repository.create(data as any);
  }

  async getAdminById(id: string) {
    const admin = await this.repository.findById(id);
    if (!admin) {
      throw new Error('Admin not found');
    }
    return admin;
  }

  async getAllAdmins() {
    return await this.repository.findAll();
  }

  async updateAdmin(id: string, data: AdminUpdateInput) {
    if (data.email) {
      const existing = await this.repository.findByEmail(data.email);
      if (existing && existing._id.toString() !== id) {
        throw new Error('Admin with this email already exists');
      }
    }

    // Validate role if provided
    if (data.role) {
      const role = await this.roleRepository.findById(data.role);
      if (!role) {
        throw new Error('Role not found');
      }
    }

    // In production, password should be hashed here if provided
    const admin = await this.repository.update(id, data as any);
    if (!admin) {
      throw new Error('Admin not found');
    }
    return admin;
  }

  async deleteAdmin(id: string) {
    const admin = await this.repository.delete(id);
    if (!admin) {
      throw new Error('Admin not found');
    }
    return admin;
  }
}
