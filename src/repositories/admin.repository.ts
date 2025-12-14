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

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<DocumentType<Admin>[]> {
    const skip = (page - 1) * limit;
    const sortObj: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };
    
    return await AdminModel.find()
      .populate('role')
      .sort(sortObj)
      .skip(skip)
      .limit(limit);
  }

  async count(): Promise<number> {
    return await AdminModel.countDocuments();
  }

  async update(id: string, data: Partial<Admin>): Promise<DocumentType<Admin> | null> {
    return await AdminModel.findByIdAndUpdate(id, data, { new: true }).populate('role');
  }

  async delete(id: string): Promise<DocumentType<Admin> | null> {
    return await AdminModel.findByIdAndDelete(id);
  }
}
