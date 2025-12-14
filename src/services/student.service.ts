import { StudentRepository } from "../repositories/student.repository";
import type { StudentCreateInput, StudentUpdateInput } from "../models/student.model";
import type { Student } from "../models/student.model";
import { NotFoundError, ConflictError } from "../utils/errors.util";
import { calculateSkip } from "../utils/pagination.util";
import type { FilterQuery } from "mongoose";

/**
 * Student Service - Business logic layer for Student
 */
export class StudentService {
  private repository: StudentRepository;

  constructor() {
    this.repository = new StudentRepository();
  }

  async createStudent(data: StudentCreateInput) {
    // StudentCreateSchema validation ensures required fields are present
    const existing = await this.repository.findByEmail(data.email!);
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

	async getAllStudents(
		page = 1,
		limit = 10,
		sortBy?: string,
		sortOrder?: "asc" | "desc",
		filter: FilterQuery<Student> = {},
	) {
		const skip = calculateSkip(page, limit);
		const students = await this.repository.findAll(
			skip,
			limit,
			sortBy,
			sortOrder,
			filter,
		);
		const total = await this.repository.count(filter);
		return { students, total };
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
