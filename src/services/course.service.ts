import type { Ref } from "@typegoose/typegoose";
import type { Admin } from "../db/models/admin.model";
import type {
	CourseCreateInput,
	CourseLevel,
	CourseUpdateInput,
} from "../db/models/course.model";
import { AdminRepository } from "../repositories/admin.repository";
import { CourseRepository } from "../repositories/course.repository";
import { ConflictError, NotFoundError } from "../utils/errors.util";
import type { MongoFilter } from "../utils/filter.util";
import {
	deleteImage,
	isBase64Image,
	saveBase64Image,
	updateImage,
} from "../utils/image.util";
import { calculateSkip } from "../utils/pagination.util";

// Subdirectory for course images
const COURSE_IMAGES_DIR = "courses";

/**
 * Convert string level to CourseLevel enum
 */
const toCourseLevelEnum = (
	level: string | null | undefined,
): CourseLevel | null | undefined => {
	if (level === null) return null;
	if (level === undefined) return undefined;
	return level as CourseLevel;
};

/**
 * Course Service - Business logic layer for Course
 */
export class CourseService {
	private repository: CourseRepository;
	private adminRepository: AdminRepository;

	constructor() {
		this.repository = new CourseRepository();
		this.adminRepository = new AdminRepository();
	}

	async createCourse(data: CourseCreateInput) {
		// Check for duplicate title
		const existing = await this.repository.findByTitle(data.title);
		if (existing) {
			throw new ConflictError("Course with this title already exists");
		}

		// Validate admin if provided
		if (data.admin) {
			const admin = await this.adminRepository.findById(data.admin);
			if (!admin) {
				throw new NotFoundError("Admin not found");
			}
		}

		// Handle image upload if provided as base64
		let imagePath = data.image || "";
		if (data.image && isBase64Image(data.image)) {
			imagePath = saveBase64Image(data.image, COURSE_IMAGES_DIR);
		}

		return await this.repository.create({
			title: data.title,
			overview: data.overview,
			resources: data.resources,
			image: imagePath,
			categories: data.categories,
			rating: data.rating,
			minute: data.minute,
			price: data.price,
			admin: data.admin as Ref<Admin> | undefined,
			level: toCourseLevelEnum(data.level),
			isActive: data.isActive,
		});
	}

	async getCourseById(id: string) {
		const course = await this.repository.findById(id);
		if (!course) {
			throw new NotFoundError("Course not found");
		}
		return course;
	}

	async getAllCourses(
		page: number = 1,
		limit: number = 10,
		sortBy?: string,
		sortOrder?: "asc" | "desc",
		filter: MongoFilter = {},
	) {
		const skip = calculateSkip(page, limit);
		const courses = await this.repository.findAll(
			skip,
			limit,
			sortBy,
			sortOrder,
			filter,
		);
		const total = await this.repository.count(filter);
		return { courses, total };
	}

	async updateCourse(id: string, data: CourseUpdateInput) {
		// Check if course exists
		const existingCourse = await this.repository.findById(id);
		if (!existingCourse) {
			throw new NotFoundError("Course not found");
		}

		// Check for duplicate title if title is being updated
		if (data.title && data.title !== existingCourse.title) {
			const duplicateTitle = await this.repository.findByTitle(data.title);
			if (duplicateTitle) {
				throw new ConflictError("Course with this title already exists");
			}
		}

		// Validate admin if provided
		if (data.admin) {
			const admin = await this.adminRepository.findById(data.admin);
			if (!admin) {
				throw new NotFoundError("Admin not found");
			}
		}

		// Handle image update if new image is provided as base64
		let imagePath = data.image;
		if (data.image && isBase64Image(data.image)) {
			// Delete old image and save new one
			imagePath = updateImage(
				existingCourse.image,
				data.image,
				COURSE_IMAGES_DIR,
			);
		}

		const course = await this.repository.update(id, {
			title: data.title,
			overview: data.overview,
			resources: data.resources,
			image: imagePath,
			categories: data.categories,
			rating: data.rating,
			minute: data.minute,
			price: data.price,
			admin: data.admin as Ref<Admin> | undefined,
			level: toCourseLevelEnum(data.level),
			isActive: data.isActive,
		});

		if (!course) {
			throw new NotFoundError("Course not found");
		}
		return course;
	}

	async deleteCourse(id: string) {
		const course = await this.repository.findById(id);
		if (!course) {
			throw new NotFoundError("Course not found");
		}

		// Delete associated image if it exists
		if (course.image) {
			deleteImage(course.image, COURSE_IMAGES_DIR);
		}

		const deletedCourse = await this.repository.delete(id);
		if (!deletedCourse) {
			throw new NotFoundError("Course not found");
		}
		return deletedCourse;
	}
}
