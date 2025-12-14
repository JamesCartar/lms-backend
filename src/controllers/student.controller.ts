import { Request, Response } from 'express';
import { StudentService } from '../services/student.service';
import { sendSuccessResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

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
    const student = await this.service.getStudentById(req.params.id);
    sendSuccessResponse(res, student);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const students = await this.service.getAllStudents();
    sendSuccessResponse(res, students);
  });

  getByEnrollmentYear = asyncHandler(async (req: Request, res: Response) => {
    const year = parseInt(req.params.year);
    const students = await this.service.getStudentsByEnrollmentYear(year);
    sendSuccessResponse(res, students);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const student = await this.service.updateStudent(req.params.id, req.body);
    sendSuccessResponse(res, student, 'Student updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteStudent(req.params.id);
    sendSuccessResponse(res, null, 'Student deleted successfully');
  });
}
