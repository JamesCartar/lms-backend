import type { DocumentType } from "@typegoose/typegoose";
import { type Course, CourseModel } from "../db/models/course.model";
import type { MongoFilter } from "../utils/filter.util";

/**
 * Course Repository - Data access layer for Course
 */
export class CourseRepository {
	async create(data: Partial<Course>): Promise<DocumentType<Course>> {
		return await CourseModel.create(data);
	}

	async findById(id: string): Promise<DocumentType<Course> | null> {
		return await CourseModel.findById(id).populate({
			path: "admin",
			select: "name email",
		});
	}

	async findAll(
		skip: number,
		limit: number,
		sortBy: string = "createdAt",
		sortOrder: "asc" | "desc" = "desc",
		filter: MongoFilter = {},
	): Promise<DocumentType<Course>[]> {
		const sortObj: Record<string, 1 | -1> = {
			[sortBy]: sortOrder === "asc" ? 1 : -1,
		};

		return await CourseModel.find(filter)
			.populate({
				path: "admin",
				select: "name email",
			})
			.sort(sortObj)
			.skip(skip)
			.limit(limit);
	}

	async count(filter: MongoFilter = {}): Promise<number> {
		return await CourseModel.countDocuments(filter);
	}

	async update(
		id: string,
		data: Partial<Course>,
	): Promise<DocumentType<Course> | null> {
		return await CourseModel.findByIdAndUpdate(id, data, { new: true }).populate(
			{
				path: "admin",
				select: "name email",
			},
		);
	}

	async delete(id: string): Promise<DocumentType<Course> | null> {
		return await CourseModel.findByIdAndDelete(id);
	}

	async findByTitle(title: string): Promise<DocumentType<Course> | null> {
		return await CourseModel.findOne({ title });
	}
}
