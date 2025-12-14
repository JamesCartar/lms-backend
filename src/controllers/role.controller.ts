import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';

/**
 * Role Controller - Handles HTTP requests for Role
 */
export class RoleController {
  private service: RoleService;

  constructor() {
    this.service = new RoleService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const role = await this.service.createRole(req.body);
      res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: role,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create role',
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const role = await this.service.getRoleById(req.params.id);
      res.status(200).json({
        success: true,
        data: role,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Role not found',
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const roles = await this.service.getAllRoles();
      res.status(200).json({
        success: true,
        data: roles,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch roles',
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const role = await this.service.updateRole(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Role updated successfully',
        data: role,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update role',
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.service.deleteRole(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Role deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete role',
      });
    }
  };
}
