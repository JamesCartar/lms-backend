import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';

/**
 * Admin Controller - Handles HTTP requests for Admin
 */
export class AdminController {
  private service: AdminService;

  constructor() {
    this.service = new AdminService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const admin = await this.service.createAdmin(req.body);
      res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        data: admin,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create admin',
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const admin = await this.service.getAdminById(req.params.id);
      res.status(200).json({
        success: true,
        data: admin,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Admin not found',
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const admins = await this.service.getAllAdmins();
      res.status(200).json({
        success: true,
        data: admins,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch admins',
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const admin = await this.service.updateAdmin(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Admin updated successfully',
        data: admin,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update admin',
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.service.deleteAdmin(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Admin deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete admin',
      });
    }
  };
}
