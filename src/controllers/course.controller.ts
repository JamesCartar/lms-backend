import type { Request, Response } from "express";
import { env } from "../config/env";
import { buildCourseFilter } from "../filters/course.filter";
import { asyncHandler } from "../middleware/error.middleware";
import { CourseService } from "../services/course.service";
import {
	calculatePaginationMeta,
	getPaginationParams,
} from "../utils/pagination.util";
import { getIdParam } from "../utils/params.util";
import { sendSuccessResponse } from "../utils/response.util";

/**
 * Course Controller - Handles HTTP requests for Course
 */
export class CourseController {
	private service: CourseService;

	constructor() {
		this.service = new CourseService();
	}

	/**
	 * Get file locations for course-related images
	 */
	private getFileLocations() {
		return {
			fileLocation: {
				courseImage: `${env.BASE_URL}/uploads/courses/`,
			},
		};
	}

	create = asyncHandler(async (req: Request, res: Response) => {
		// Get uploaded file filename if present
		const imageFilename = req.file?.filename;
		const course = await this.service.createCourse(req.body, imageFilename);
		sendSuccessResponse(res, {
			data: {
				...course.toObject(),
				...this.getFileLocations(),
			},
			message: "Course created successfully",
			statusCode: 201,
		});
	});

	getById = asyncHandler(async (req: Request, res: Response) => {
		const course = await this.service.getCourseById(getIdParam(req));
		sendSuccessResponse(res, {
			data: {
				...course.toObject(),
				...this.getFileLocations(),
			},
		});
	});

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, sortOrder } = getPaginationParams(req);

		// Get validated filter query from middleware
		const filterQuery = req.validatedQuery || {};
		const filter = buildCourseFilter(filterQuery);

		const { courses, total } = await this.service.getAllCourses(
			page,
			limit,
			sortBy,
			sortOrder,
			filter,
		);
		const pagination = calculatePaginationMeta(page, limit, total);

		// Add file locations to each course
		const coursesWithFileLocations = courses.map((course) => ({
			...course.toObject(),
			...this.getFileLocations(),
		}));

		sendSuccessResponse(res, {
			data: coursesWithFileLocations,
			message: "Courses retrieved successfully",
			pagination,
		});
	});

	update = asyncHandler(async (req: Request, res: Response) => {
		// Get uploaded file filename if present
		const imageFilename = req.file?.filename;
		const course = await this.service.updateCourse(getIdParam(req), req.body, imageFilename);
		sendSuccessResponse(res, {
			data: {
				...course.toObject(),
				...this.getFileLocations(),
			},
			message: "Course updated successfully",
		});
	});

	delete = asyncHandler(async (req: Request, res: Response) => {
		await this.service.deleteCourse(getIdParam(req));
		sendSuccessResponse(res, {
			data: null,
			message: "Course deleted successfully",
		});
	});
}
