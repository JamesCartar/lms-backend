import { AdminModel, Admin } from '../models/admin.model';
import { DocumentType } from '@typegoose/typegoose';

/**
 * Admin Repository - Data access layer for Admin
 */
export class AdminRepository {
  async create(data: Partial<Admin>): Promise<DocumentType<Admin>> {
    return await AdminModel.create(data);
  }

  async findById(id: string): Promise<DocumentType<Admin> | null> {
    return await AdminModel.findById(id).populate('role');
  }

  async findByEmail(email: string): Promise<DocumentType<Admin> | null> {
    return await AdminModel.findOne({ email }).populate('role');
  }

  async findAll(): Promise<DocumentType<Admin>[]> {
    return await AdminModel.find().populate('role');
  }

  async update(id: string, data: Partial<Admin>): Promise<DocumentType<Admin> | null> {
    return await AdminModel.findByIdAndUpdate(id, data, { new: true }).populate('role');
  }

  async delete(id: string): Promise<DocumentType<Admin> | null> {
    return await AdminModel.findByIdAndDelete(id);
  }
}
