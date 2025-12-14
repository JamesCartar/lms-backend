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
    // Validation ensures required fields exist, but TypeScript doesn't know that
    if (!data.email || !data.name || !data.password) {
      throw new Error('Email, name, and password are required');
    }
    
    const existing = await this.repository.findByEmail(data.email);
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
    return await this.repository.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role as any,
      isActive: data.isActive,
    });
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
    const admin = await this.repository.update(id, {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role as any,
      isActive: data.isActive,
    });
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
