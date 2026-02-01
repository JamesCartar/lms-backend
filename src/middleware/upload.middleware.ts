import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { BadRequestError } from "../utils/errors.util";

/**
 * File Upload Middleware using Multer
 * Handles multipart/form-data file uploads
 */

// Base directory for uploads
const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

/**
 * Ensure the uploads directory exists
 */
const ensureUploadsDir = (subDir?: string): string => {
	const targetDir = subDir ? path.join(UPLOADS_DIR, subDir) : UPLOADS_DIR;
	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, { recursive: true });
	}
	return targetDir;
};

/**
 * Allowed image MIME types
 */
const ALLOWED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/svg+xml",
];

/**
 * Create multer storage configuration for a specific subdirectory
 */
const createStorage = (subDir: string) => {
	return multer.diskStorage({
		destination: (_req, _file, cb) => {
			const targetDir = ensureUploadsDir(subDir);
			cb(null, targetDir);
		},
		filename: (_req, file, cb) => {
			// Generate UUID-based filename
			const ext = path.extname(file.originalname).toLowerCase();
			const uuid = crypto.randomUUID();
			const filename = `${uuid}${ext}`;
			cb(null, filename);
		},
	});
};

/**
 * File filter to validate image uploads
 */
const imageFileFilter = (
	_req: Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback,
) => {
	if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new BadRequestError("Only image files are allowed (jpeg, jpg, png, gif, webp, svg)"));
	}
};

/**
 * Create multer upload middleware for course images
 */
export const courseImageUpload = multer({
	storage: createStorage("courses"),
	fileFilter: imageFileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB max file size
	},
});

/**
 * Middleware to handle single image upload for courses
 * The field name should be "image"
 */
export const uploadCourseImage = (req: Request, res: Response, next: NextFunction) => {
	const upload = courseImageUpload.single("image");

	upload(req, res, (err) => {
		if (err instanceof multer.MulterError) {
			if (err.code === "LIMIT_FILE_SIZE") {
				return next(new BadRequestError("File size too large. Maximum size is 5MB"));
			}
			return next(new BadRequestError(`Upload error: ${err.message}`));
		}
		if (err) {
			return next(err);
		}
		next();
	});
};

/**
 * Delete an uploaded file
 */
export const deleteUploadedFile = (filename: string, subDir?: string): boolean => {
	if (!filename) {
		return false;
	}

	const targetDir = subDir ? path.join(UPLOADS_DIR, subDir) : UPLOADS_DIR;
	const absolutePath = path.join(targetDir, filename);

	// Safety check: ensure the path is within uploads directory
	if (!absolutePath.startsWith(UPLOADS_DIR)) {
		throw new BadRequestError("Invalid file path");
	}

	if (fs.existsSync(absolutePath)) {
		fs.unlinkSync(absolutePath);
		return true;
	}

	return false;
};
