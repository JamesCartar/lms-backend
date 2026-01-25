import bcrypt from "bcryptjs";
import { env } from "../config/env";
import type {
	StudentCreateInput,
	StudentUpdateInput,
} from "../db/models/student.model";
import { StudentRepository } from "../repositories/student.repository";
import { ConflictError, NotFoundError } from "../utils/errors.util";
import type { MongoFilter } from "../utils/filter.util";
import { calculateSkip } from "../utils/pagination.util";

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
		const existing = await this.repository.findByEmail(data.email);
		if (existing) {
			throw new ConflictError("Student with this email already exists");
		}

		// In production, password should be hashed here

		const hashedPassword = await bcrypt.hash(data.password, env.SALT_ROUNDS);

		return await this.repository.create({
			...data,
			password: hashedPassword,
		});
	}

	async getStudentById(id: string) {
		const student = await this.repository.findById(id);

		if (!student) {
			throw new NotFoundError("Student not found");
		}

		const { password: _, ...studentWithoutPassword } = student;

		return studentWithoutPassword;
	}

	async getAllStudents(
		page: number = 1,
		limit: number = 10,
		sortBy?: string,
		sortOrder?: "asc" | "desc",
		filter: MongoFilter = {},
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
				throw new ConflictError("Student with this email already exists");
			}
		}

		if (data.password) {
			const hashedPassword = await bcrypt.hash(data.password, env.SALT_ROUNDS);
			data.password = hashedPassword;
		}

		// In production, password should be hashed here if provided
		const student = await this.repository.update(id, data);
		if (!student) {
			throw new NotFoundError("Student not found");
		}
		return student;
	}

	async deleteStudent(id: string) {
		const student = await this.repository.delete(id);
		if (!student) {
			throw new NotFoundError("Student not found");
		}
		return student;
	}
}
