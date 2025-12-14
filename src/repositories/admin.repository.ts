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
    return await AdminModel.findById(id).populate({
      path: 'role',
      select: 'name description type'
    });
  }

  async findByEmail(email: string): Promise<DocumentType<Admin> | null> {
    return await AdminModel.findOne({ email }).populate({
      path: 'role',
      select: 'name description type'
    });
  }

  async findAll(
    skip: number,
    limit: number,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    filter: Record<string, any> = {}
  ): Promise<DocumentType<Admin>[]> {
    const sortObj: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };
    
    return await AdminModel.find(filter)
      .populate({
        path: 'role',
        select: 'name description type'
      })
      .sort(sortObj)
      .skip(skip)
      .limit(limit);
  }

  async count(filter: Record<string, any> = {}): Promise<number> {
    return await AdminModel.countDocuments(filter);
  }

  async update(id: string, data: Partial<Admin>): Promise<DocumentType<Admin> | null> {
    return await AdminModel.findByIdAndUpdate(id, data, { new: true }).populate({
      path: 'role',
      select: 'name description type'
    });
  }

  async delete(id: string): Promise<DocumentType<Admin> | null> {
    return await AdminModel.findByIdAndDelete(id);
  }
}
