import { type Module, ModuleModel } from "../db/models/module.model";
import type { MongoFilter } from "../utils/filter.util";

export class ModuleRepository {

    async create(data: Partial<Module>) {
        return await ModuleModel.create(data)
    }

    async findAll({
        skip,
        limit,
        sortBy = "createdAt",
        sortOrder = "desc",
        filter = {},
    }: {
        skip: number;
        limit: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        filter?: MongoFilter;
    }) {
        const sortObj: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };

        return ModuleModel.find(filter).sort(sortObj).skip(skip).limit(limit);
    }

    async findById(id: string) {
        return await ModuleModel.findById(id)
    }


    async count(filter: MongoFilter = {}) {
        return await ModuleModel.countDocuments(filter);
    }


    async update(
        id: string,
        data: Partial<Module>,
    ) {
        return await ModuleModel.findByIdAndUpdate(id, data, { new: true })
    }

    async delete(id: string) {
        return await ModuleModel.findByIdAndDelete(id);
    }
}