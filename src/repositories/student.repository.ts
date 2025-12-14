import { StudentModel, Student } from '../models/student.model';
import { DocumentType } from '@typegoose/typegoose';

/**
 * Student Repository - Data access layer for Student
 */
export class StudentRepository {
  async create(data: Partial<Student>): Promise<DocumentType<Student>> {
    return await StudentModel.create(data);
  }

  async findById(id: string): Promise<DocumentType<Student> | null> {
    return await StudentModel.findById(id);
  }

  async findByEmail(email: string): Promise<DocumentType<Student> | null> {
    return await StudentModel.findOne({ email });
  }

  async findAll(): Promise<DocumentType<Student>[]> {
    return await StudentModel.find();
  }

  async update(id: string, data: Partial<Student>): Promise<DocumentType<Student> | null> {
    return await StudentModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<DocumentType<Student> | null> {
    return await StudentModel.findByIdAndDelete(id);
  }

  async findByEnrollmentYear(year: number): Promise<DocumentType<Student>[]> {
    return await StudentModel.find({ enrollmentYear: year });
  }
}
