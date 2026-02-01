import { ModuleRepository } from "../repositories/module.repository";
import type { MongoFilter } from "../utils/filter.util";
import { calculateSkip } from "../utils/pagination.util";

export class ModuleService {
    private repository: ModuleRepository

    constructor() {
        this.repository = new ModuleRepository()
    }

    async getAllModules({
        page = 1,
        limit = 10,
        sortBy,
        sortOrder,
        filter = {},
    }: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        filter?: MongoFilter;
    }) {
        const skip = calculateSkip(page, limit);

        const modules = await this.repository.findAll({
            skip,
            limit,
            sortBy,
            sortOrder,
            filter,
        });

        const total = await this.repository.count(filter);

        return { modules, total };
    }
}