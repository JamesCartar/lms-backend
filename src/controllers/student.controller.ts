import { Request, Response } from 'express';
import { StudentService } from '../services/student.service';
import { sendSuccessResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';
import { getPaginationParams, calculatePaginationMeta } from '../utils/pagination.util';
import { getIdParam, getRequiredParam } from '../utils/params.util';
import { BadRequestError } from '../utils/errors.util';

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
    sendSuccessResponse(res, student, 'Student created successfully', 201);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const student = await this.service.getStudentById(getIdParam(req));
    sendSuccessResponse(res, student);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req);
    const { students, total } = await this.service.getAllStudents(page, limit, sortBy, sortOrder);
    const pagination = calculatePaginationMeta(page, limit, total);
    sendSuccessResponse(res, students, 'Students retrieved successfully', 200, pagination);
  });

  getByEnrollmentYear = asyncHandler(async (req: Request, res: Response) => {
    const yearStr = getRequiredParam(req, 'year');
    const year = parseInt(yearStr);
    if (isNaN(year)) {
      throw new BadRequestError('Invalid year parameter');
    }
    const students = await this.service.getStudentsByEnrollmentYear(year);
    sendSuccessResponse(res, students);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const student = await this.service.updateStudent(getIdParam(req), req.body);
    sendSuccessResponse(res, student, 'Student updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteStudent(getIdParam(req));
    sendSuccessResponse(res, null, 'Student deleted successfully');
  });
}
