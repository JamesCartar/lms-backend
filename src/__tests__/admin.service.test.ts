import { AdminService } from "../services/admin.service";
import { ConflictError, NotFoundError } from "../utils/errors.util";

const adminRepoMock = {
	findByEmail: jest.fn(),
	create: jest.fn(),
	findById: jest.fn(),
	findAll: jest.fn(),
	count: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
};

const roleRepoMock = {
	findById: jest.fn(),
};

jest.mock("../repositories/admin.repository", () => ({
	AdminRepository: jest.fn().mockImplementation(() => adminRepoMock),
}));

jest.mock("../repositories/role.repository", () => ({
	RoleRepository: jest.fn().mockImplementation(() => roleRepoMock),
}));

describe("AdminService", () => {
	let service: AdminService;

	beforeEach(() => {
		jest.clearAllMocks();
		service = new AdminService();
	});

	afterEach(() => {
		(Object.values(adminRepoMock) as jest.Mock[]).forEach((fn) =>
			fn.mockReset(),
		);
		(Object.values(roleRepoMock) as jest.Mock[]).forEach((fn) =>
			fn.mockReset(),
		);
	});

	describe("createAdmin", () => {
		it("throws ConflictError when email already exists", async () => {
			adminRepoMock.findByEmail.mockResolvedValue({ _id: "existing-id" });

			await expect(
				service.createAdmin({
					name: "Test",
					email: "admin@example.com",
					password: "secret",
					isActive: true,
				}),
			).rejects.toBeInstanceOf(ConflictError);
		});

		it("throws NotFoundError when provided role does not exist", async () => {
			adminRepoMock.findByEmail.mockResolvedValue(null);
			roleRepoMock.findById.mockResolvedValue(null);

			await expect(
				service.createAdmin({
					name: "Test",
					email: "admin@example.com",
					password: "secret",
					role: "missing-role",
					isActive: true,
				}),
			).rejects.toBeInstanceOf(NotFoundError);
		});

		it("creates admin when data is valid", async () => {
			adminRepoMock.findByEmail.mockResolvedValue(null);
			roleRepoMock.findById.mockResolvedValue({ _id: "role-id" });
			const created = { _id: "admin-id", email: "admin@example.com" };
			adminRepoMock.create.mockResolvedValue(created);

			const result = await service.createAdmin({
				name: "Test Admin",
				email: "admin@example.com",
				password: "secret",
				role: "role-id",
				isActive: true,
			});

			expect(adminRepoMock.create).toHaveBeenCalledWith({
				name: "Test Admin",
				email: "admin@example.com",
				password: "secret",
				role: "role-id",
				isActive: true,
			});
			expect(result).toBe(created);
		});
	});

	describe("getAdminById", () => {
		it("throws NotFoundError when admin is missing", async () => {
			adminRepoMock.findById.mockResolvedValue(null);

			await expect(service.getAdminById("missing-id")).rejects.toBeInstanceOf(
				NotFoundError,
			);
		});

		it("returns admin when found", async () => {
			const admin = { _id: "admin-id", email: "admin@example.com" };
			adminRepoMock.findById.mockResolvedValue(admin);

			await expect(service.getAdminById("admin-id")).resolves.toBe(admin);
		});
	});

	describe("getAllAdmins", () => {
		it("returns admins with pagination metadata", async () => {
			const admins = [{ _id: "admin-1" }];
			adminRepoMock.findAll.mockResolvedValue(admins);
			adminRepoMock.count.mockResolvedValue(15);

			const result = await service.getAllAdmins(
				2,
				5,
				"email",
				"asc",
				{ isActive: true },
			);

			expect(adminRepoMock.findAll).toHaveBeenCalledWith(
				5,
				5,
				"email",
				"asc",
				{ isActive: true },
			);
			expect(adminRepoMock.count).toHaveBeenCalledWith({ isActive: true });
			expect(result).toEqual({ admins, total: 15 });
		});
	});

	describe("updateAdmin", () => {
		it("throws ConflictError when email belongs to another admin", async () => {
			adminRepoMock.findByEmail.mockResolvedValue({
				_id: { toString: () => "different-id" },
			});

			await expect(
				service.updateAdmin("admin-id", { email: "taken@example.com" }),
			).rejects.toBeInstanceOf(ConflictError);
		});

		it("throws NotFoundError when role does not exist", async () => {
			adminRepoMock.findByEmail.mockResolvedValue(null);
			roleRepoMock.findById.mockResolvedValue(null);

			await expect(
				service.updateAdmin("admin-id", { role: "missing-role" }),
			).rejects.toBeInstanceOf(NotFoundError);
		});

		it("throws NotFoundError when admin not found on update", async () => {
			adminRepoMock.findByEmail.mockResolvedValue(null);
			roleRepoMock.findById.mockResolvedValue({ _id: "role-id" });
			adminRepoMock.update.mockResolvedValue(null);

			await expect(
				service.updateAdmin("admin-id", { name: "Updated" }),
			).rejects.toBeInstanceOf(NotFoundError);
		});

		it("updates admin when data is valid", async () => {
			adminRepoMock.findByEmail.mockResolvedValue(null);
			roleRepoMock.findById.mockResolvedValue({ _id: "role-id" });
			const updated = { _id: "admin-id", name: "Updated" };
			adminRepoMock.update.mockResolvedValue(updated);

			const result = await service.updateAdmin("admin-id", {
				name: "Updated",
				role: "role-id",
			});

			expect(adminRepoMock.update).toHaveBeenCalledWith("admin-id", {
				name: "Updated",
				role: "role-id",
			});
			expect(result).toBe(updated);
		});
	});

	describe("deleteAdmin", () => {
		it("throws NotFoundError when admin does not exist", async () => {
			adminRepoMock.delete.mockResolvedValue(null);

			await expect(service.deleteAdmin("missing-id")).rejects.toBeInstanceOf(
				NotFoundError,
			);
		});

		it("deletes and returns admin when found", async () => {
			const admin = { _id: "admin-id" };
			adminRepoMock.delete.mockResolvedValue(admin);

			await expect(service.deleteAdmin("admin-id")).resolves.toBe(admin);
		});
	});
});
