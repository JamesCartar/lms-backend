import { Request, Response } from 'express';
import { PermissionService } from '../services/permission.service';

/**
 * Permission Controller - Handles HTTP requests for Permission
 */
export class PermissionController {
  private service: PermissionService;

  constructor() {
    this.service = new PermissionService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const permission = await this.service.createPermission(req.body);
      res.status(201).json({
        success: true,
        message: 'Permission created successfully',
        data: permission,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create permission',
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const permission = await this.service.getPermissionById(req.params.id);
      res.status(200).json({
        success: true,
        data: permission,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Permission not found',
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const permissions = await this.service.getAllPermissions();
      res.status(200).json({
        success: true,
        data: permissions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch permissions',
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const permission = await this.service.updatePermission(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Permission updated successfully',
        data: permission,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update permission',
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.service.deletePermission(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Permission deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete permission',
      });
    }
  };
}
