import type { Request, Response } from "express";
import { AdminController } from "../controllers/admin.controller";
import { buildAdminFilter } from "../filters/admin.filter";
import {
	calculatePaginationMeta,
	getPaginationParams,
} from "../utils/pagination.util";
import { getIdParam } from "../utils/params.util";
import { sendSuccessResponse } from "../utils/response.util";

const serviceMock = {
	createAdmin: jest.fn(),
	getAdminById: jest.fn(),
	getAllAdmins: jest.fn(),
	updateAdmin: jest.fn(),
	deleteAdmin: jest.fn(),
};

jest.mock("../services/admin.service", () => ({
	AdminService: jest.fn().mockImplementation(() => serviceMock),
}));

jest.mock("../utils/response.util", () => ({
	sendSuccessResponse: jest.fn(),
}));

jest.mock("../utils/pagination.util", () => ({
	getPaginationParams: jest.fn(),
	calculatePaginationMeta: jest.fn(),
}));

jest.mock("../utils/params.util", () => ({
	getIdParam: jest.fn(),
}));

jest.mock("../filters/admin.filter", () => ({
	buildAdminFilter: jest.fn(),
}));

jest.mock("../middleware/error.middleware", () => ({
	asyncHandler: (fn: unknown) => fn,
}));

describe("AdminController", () => {
	let controller: AdminController;

	beforeEach(() => {
		jest.clearAllMocks();
		controller = new AdminController();
	});

	const createMockResponse = () => {
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};
		return res as unknown as Response;
	};

	describe("create", () => {
		it("creates admin and sends success response", async () => {
			const req = {
				body: { email: "admin@example.com" },
			} as Request;
			const res = createMockResponse();
			const admin = { id: "1" };
			serviceMock.createAdmin.mockResolvedValue(admin);

			await controller.create(req, res, jest.fn());

			expect(serviceMock.createAdmin).toHaveBeenCalledWith(req.body);
			expect(sendSuccessResponse).toHaveBeenCalledWith(res, {
				data: admin,
				message: "Admin created successfully",
				statusCode: 201,
			});
		});
	});

	describe("getById", () => {
		it("retrieves admin by id", async () => {
			const req = {} as Request;
			const res = createMockResponse();
			(getIdParam as jest.Mock).mockReturnValue("admin-id");
			const admin = { id: "admin-id" };
			serviceMock.getAdminById.mockResolvedValue(admin);

			await controller.getById(req, res, jest.fn());

			expect(getIdParam).toHaveBeenCalledWith(req);
			expect(sendSuccessResponse).toHaveBeenCalledWith(res, { data: admin });
		});
	});

	describe("getAll", () => {
		it("returns admins with pagination metadata", async () => {
			const req = {
				validatedQuery: { isActive: true },
			} as Request;
			const res = createMockResponse();
			(getPaginationParams as jest.Mock).mockReturnValue({
				page: 2,
				limit: 5,
				sortBy: "name",
				sortOrder: "asc",
			});
			(buildAdminFilter as jest.Mock).mockReturnValue({ isActive: true });
			serviceMock.getAllAdmins.mockResolvedValue({
				admins: [{ id: "1" }],
				total: 12,
			});
			(calculatePaginationMeta as jest.Mock).mockReturnValue({
				page: 2,
				limit: 5,
				total: 12,
				totalPages: 3,
				hasNextPage: true,
				hasPrevPage: true,
			});

			await controller.getAll(req, res, jest.fn());

			expect(getPaginationParams).toHaveBeenCalledWith(req);
			expect(buildAdminFilter).toHaveBeenCalledWith(req.validatedQuery);
			expect(serviceMock.getAllAdmins).toHaveBeenCalledWith(
				2,
				5,
				"name",
				"asc",
				{ isActive: true },
			);
			expect(sendSuccessResponse).toHaveBeenCalledWith(res, {
				data: [{ id: "1" }],
				message: "Admins retrieved successfully",
				pagination: {
					page: 2,
					limit: 5,
					total: 12,
					totalPages: 3,
					hasNextPage: true,
					hasPrevPage: true,
				},
			});
		});
	});

	describe("update", () => {
		it("updates admin and returns response", async () => {
			const req = {
				body: { name: "Updated" },
			} as Request;
			const res = createMockResponse();
			(getIdParam as jest.Mock).mockReturnValue("admin-id");
			const admin = { id: "admin-id", name: "Updated" };
			serviceMock.updateAdmin.mockResolvedValue(admin);

			await controller.update(req, res, jest.fn());

			expect(serviceMock.updateAdmin).toHaveBeenCalledWith(
				"admin-id",
				req.body,
			);
			expect(sendSuccessResponse).toHaveBeenCalledWith(res, {
				data: admin,
				message: "Admin updated successfully",
			});
		});
	});

	describe("delete", () => {
		it("deletes admin and returns success message", async () => {
			const req = {} as Request;
			const res = createMockResponse();
			(getIdParam as jest.Mock).mockReturnValue("admin-id");
			serviceMock.deleteAdmin.mockResolvedValue(true);

			await controller.delete(req, res, jest.fn());

			expect(serviceMock.deleteAdmin).toHaveBeenCalledWith("admin-id");
			expect(sendSuccessResponse).toHaveBeenCalledWith(res, {
				data: null,
				message: "Admin deleted successfully",
			});
		});
	});
});
