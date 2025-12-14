import { Request, Response } from 'express';
import { StudentService } from '../services/student.service';

/**
 * Student Controller - Handles HTTP requests for Student
 */
export class StudentController {
  private service: StudentService;

  constructor() {
    this.service = new StudentService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const student = await this.service.createStudent(req.body);
      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: student,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create student',
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const student = await this.service.getStudentById(req.params.id);
      res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Student not found',
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const students = await this.service.getAllStudents();
      res.status(200).json({
        success: true,
        data: students,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch students',
      });
    }
  };

  getByEnrollmentYear = async (req: Request, res: Response) => {
    try {
      const year = parseInt(req.params.year);
      const students = await this.service.getStudentsByEnrollmentYear(year);
      res.status(200).json({
        success: true,
        data: students,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch students',
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const student = await this.service.updateStudent(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: student,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update student',
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.service.deleteStudent(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Student deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete student',
      });
    }
  };
}
