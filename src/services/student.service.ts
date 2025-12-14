import { StudentRepository } from '../repositories/student.repository';
import { StudentCreateInput, StudentUpdateInput } from '../models/student.model';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors.util';

/**
 * Student Service - Business logic layer for Student
 */
export class StudentService {
  private repository: StudentRepository;

  constructor() {
    this.repository = new StudentRepository();
  }

  async createStudent(data: StudentCreateInput) {
    // Validation ensures required fields exist, but TypeScript doesn't know that
    if (!data.email || !data.firstName || !data.lastName || !data.password) {
      throw new BadRequestError('Email, firstName, lastName, and password are required');
    }
    
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('Student with this email already exists');
    }

    // In production, password should be hashed here
    return await this.repository.create(data);
  }

  async getStudentById(id: string) {
    const student = await this.repository.findById(id);
    if (!student) {
      throw new NotFoundError('Student not found');
    }
    return student;
  }

  async getAllStudents() {
    return await this.repository.findAll();
  }

  async getStudentsByEnrollmentYear(year: number) {
    return await this.repository.findByEnrollmentYear(year);
  }

  async updateStudent(id: string, data: StudentUpdateInput) {
    if (data.email) {
      const existing = await this.repository.findByEmail(data.email);
      if (existing && existing._id.toString() !== id) {
        throw new ConflictError('Student with this email already exists');
      }
    }

    // In production, password should be hashed here if provided
    const student = await this.repository.update(id, data);
    if (!student) {
      throw new NotFoundError('Student not found');
    }
    return student;
  }

  async deleteStudent(id: string) {
    const student = await this.repository.delete(id);
    if (!student) {
      throw new NotFoundError('Student not found');
    }
    return student;
  }
}
