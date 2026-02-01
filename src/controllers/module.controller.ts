import type { Request, Response } from "express";
import { buildAdminFilter } from "../filters/admin.filter";
import { asyncHandler } from "../middleware/error.middleware";
import { ModuleService } from "../services/module.service";
import {
    calculatePaginationMeta,
    getPaginationParams,
} from "../utils/pagination.util";
import { sendSuccessResponse } from "../utils/response.util";

export class ModuleController {
    private service: ModuleService;


    constructor() {
        this.service = new ModuleService();
    }

    // create = asyncHandler(async (req: Request, res: Response) => {
    //     const admin = await this.service.createModule(req.body);
    //     sendSuccessResponse(res, {
    //         data: admin,
    //         message: "Admin created successfully",
    //         statusCode: 201,
    //     });
    // });

    // getById = asyncHandler(async (req: Request, res: Response) => {
    //     const admin = await this.service.getAdminById(getIdParam(req));
    //     sendSuccessResponse(res, { data: admin });
    // });

    getAll = asyncHandler(async (req: Request, res: Response) => {
        console.log("in controller");
        const { page, limit, sortBy, sortOrder } = getPaginationParams(req);

        // Get validated filter query from middleware
        const filterQuery = req.validatedQuery || {};
        const filter = buildAdminFilter(filterQuery);

        const { modules, total } = await this.service.getAllModules(
            {
                page,
                limit,
                sortBy,
                sortOrder,
                filter,
            }
        );
        const pagination = calculatePaginationMeta(page, limit, total);
        sendSuccessResponse(res, {
            data: modules,
            message: "Modules retrieved successfully",
            pagination,
        });
    });

    // update = asyncHandler(async (req: Request, res: Response) => {
    //     const admin = await this.service.updateAdmin(getIdParam(req), req.body);
    //     sendSuccessResponse(res, {
    //         data: admin,
    //         message: "Admin updated successfully",
    //     });
    // });

    // delete = asyncHandler(async (req: Request, res: Response) => {
    //     await this.service.deleteAdmin(getIdParam(req));
    //     sendSuccessResponse(res, {
    //         data: null,
    //         message: "Admin deleted successfully",
    //     });
    // });
}
