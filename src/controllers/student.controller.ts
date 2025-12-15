import type { Request, Response } from "express";
import { buildStudentFilter } from "../filters/student.filter";
import { asyncHandler } from "../middleware/error.middleware";
import { StudentService } from "../services/student.service";
import { BadRequestError } from "../utils/errors.util";
import {
	calculatePaginationMeta,
	getPaginationParams,
} from "../utils/pagination.util";
import { getIdParam, getRequiredParam } from "../utils/params.util";
import { sendSuccessResponse } from "../utils/response.util";

/**
 * Student Controller - Handles HTTP requests for Student
 */
export class StudentController {
	private service: StudentService;

	constructor() {
		this.service = new StudentService();
	}

	create = asyncHandler(async (req: Request, res: Response) => {
		const student = await this.service.createStudent(req.body);
		sendSuccessResponse(res, {
			data: student,
			message: "Student created successfully",
			statusCode: 201,
		});
	});

	getById = asyncHandler(async (req: Request, res: Response) => {
		const student = await this.service.getStudentById(getIdParam(req));
		sendSuccessResponse(res, { data: student });
	});

	getAll = asyncHandler(async (req: Request, res: Response) => {
		const { page, limit, sortBy, sortOrder } = getPaginationParams(req);

		// Get validated filter query from middleware
		const filterQuery = req.validatedQuery || {};
		const filter = buildStudentFilter(filterQuery);

		const { students, total } = await this.service.getAllStudents(
			page,
			limit,
			sortBy,
			sortOrder,
			filter,
		);
		const pagination = calculatePaginationMeta(page, limit, total);
		sendSuccessResponse(res, {
			data: students,
			message: "Students retrieved successfully",
			pagination,
		});
	});

	getByEnrollmentYear = asyncHandler(async (req: Request, res: Response) => {
		const yearStr = getRequiredParam(req, "year");
		const year = parseInt(yearStr, 10);
		if (Number.isNaN(year)) {
			throw new BadRequestError("Invalid year parameter");
		}
		const students = await this.service.getStudentsByEnrollmentYear(year);
		sendSuccessResponse(res, { data: students });
	});

	update = asyncHandler(async (req: Request, res: Response) => {
		const student = await this.service.updateStudent(getIdParam(req), req.body);
		sendSuccessResponse(res, {
			data: student,
			message: "Student updated successfully",
		});
	});

	delete = asyncHandler(async (req: Request, res: Response) => {
		await this.service.deleteStudent(getIdParam(req));
		sendSuccessResponse(res, {
			data: null,
			message: "Student deleted successfully",
		});
	});
}
