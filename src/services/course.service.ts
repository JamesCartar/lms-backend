import type { Ref } from "@typegoose/typegoose";
import type { Admin } from "../db/models/admin.model";
import type {
	CourseCreateInput,
	CourseLevel,
	CourseUpdateInput,
} from "../db/models/course.model";
import { deleteUploadedFile } from "../middleware/upload.middleware";
import { AdminRepository } from "../repositories/admin.repository";
import { CourseRepository } from "../repositories/course.repository";
import { ConflictError, NotFoundError } from "../utils/errors.util";
import type { MongoFilter } from "../utils/filter.util";
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

	async createCourse(data: CourseCreateInput, imageFilename?: string) {
		// Check for duplicate title
		const existing = await this.repository.findByTitle(data.title);
		if (existing) {
			// Delete uploaded file if course creation fails
			if (imageFilename) {
				deleteUploadedFile(imageFilename, COURSE_IMAGES_DIR);
			}
			throw new ConflictError("Course with this title already exists");
		}

		// Validate admin if provided
		if (data.admin) {
			const admin = await this.adminRepository.findById(data.admin);
			if (!admin) {
				// Delete uploaded file if admin validation fails
				if (imageFilename) {
					deleteUploadedFile(imageFilename, COURSE_IMAGES_DIR);
				}
				throw new NotFoundError("Admin not found");
			}
		}

		return await this.repository.create({
			title: data.title,
			overview: data.overview,
			resources: data.resources,
			image: imageFilename || "",
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

	async updateCourse(id: string, data: CourseUpdateInput, imageFilename?: string) {
		// Check if course exists
		const existingCourse = await this.repository.findById(id);
		if (!existingCourse) {
			// Delete uploaded file if course not found
			if (imageFilename) {
				deleteUploadedFile(imageFilename, COURSE_IMAGES_DIR);
			}
			throw new NotFoundError("Course not found");
		}

		// Check for duplicate title if title is being updated
		if (data.title && data.title !== existingCourse.title) {
			const duplicateTitle = await this.repository.findByTitle(data.title);
			if (duplicateTitle) {
				// Delete uploaded file if duplicate title found
				if (imageFilename) {
					deleteUploadedFile(imageFilename, COURSE_IMAGES_DIR);
				}
				throw new ConflictError("Course with this title already exists");
			}
		}

		// Validate admin if provided
		if (data.admin) {
			const admin = await this.adminRepository.findById(data.admin);
			if (!admin) {
				// Delete uploaded file if admin validation fails
				if (imageFilename) {
					deleteUploadedFile(imageFilename, COURSE_IMAGES_DIR);
				}
				throw new NotFoundError("Admin not found");
			}
		}

		// Handle image update: if new image is uploaded, delete old one
		let finalImagePath = existingCourse.image;
		if (imageFilename) {
			// Delete old image if it exists
			if (existingCourse.image) {
				deleteUploadedFile(existingCourse.image, COURSE_IMAGES_DIR);
			}
			finalImagePath = imageFilename;
		}

		const course = await this.repository.update(id, {
			title: data.title,
			overview: data.overview,
			resources: data.resources,
			image: finalImagePath,
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
			deleteUploadedFile(course.image, COURSE_IMAGES_DIR);
		}

		const deletedCourse = await this.repository.delete(id);
		if (!deletedCourse) {
			throw new NotFoundError("Course not found");
		}
		return deletedCourse;
	}
}
