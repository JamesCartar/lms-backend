import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import { BadRequestError } from "./errors.util";

/**
 * Image Upload Utility - Handles file upload and deletion operations
 * Reusable for any feature that requires image handling
 */

// Base directory for uploads (can be configured via environment)
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
 * Generate a UUID-based unique filename for uploaded files
 */
const generateUniqueFilename = (originalFilename: string): string => {
	const ext = path.extname(originalFilename);
	const uuid = crypto.randomUUID();
	return `${uuid}${ext}`;
};

/**
 * Validate image file extension
 */
const isValidImageExtension = (filename: string): boolean => {
	const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
	const ext = path.extname(filename).toLowerCase();
	return validExtensions.includes(ext);
};

/**
 * Save a base64 encoded image to the uploads directory
 * @param base64Data - Base64 encoded image data (can include data:image/... prefix)
 * @param subDir - Optional subdirectory within uploads (e.g., "courses", "users")
 * @param originalFilename - Optional original filename for extension detection
 * @returns The relative path to the saved file
 */
export const saveBase64Image = (
	base64Data: string,
	subDir?: string,
	originalFilename?: string,
): string => {
	// Extract the actual base64 content if it includes the data URL prefix
	let imageData = base64Data;
	let detectedExtension = ".png"; // Default extension

	if (base64Data.includes("base64,")) {
		const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
		if (matches?.[1] && matches[2]) {
			const format = matches[1];
			imageData = matches[2];
			detectedExtension = format === "jpeg" ? ".jpg" : `.${format}`;
		} else {
			const parts = base64Data.split("base64,");
			if (parts[1]) {
				imageData = parts[1];
			}
		}
	}

	// Determine file extension
	let ext = detectedExtension;
	if (originalFilename && isValidImageExtension(originalFilename)) {
		ext = path.extname(originalFilename).toLowerCase();
	}

	// Generate unique filename
	const filename = generateUniqueFilename(`image${ext}`);

	// Ensure directory exists and get full path
	const targetDir = ensureUploadsDir(subDir);
	const filePath = path.join(targetDir, filename);

	// Decode and save the image
	const buffer = Buffer.from(imageData, "base64");
	fs.writeFileSync(filePath, buffer);

	// Return only the UUID filename for storage in database
	return filename;
};

/**
 * Delete an image file from the uploads directory
 * @param filename - The UUID filename (as stored in database)
 * @param subDir - Optional subdirectory within uploads (e.g., "courses", "users")
 * @returns True if file was deleted, false if file didn't exist
 */
export const deleteImage = (filename: string, subDir?: string): boolean => {
	if (!filename) {
		return false;
	}

	// Build the absolute path from filename and subdirectory
	const targetDir = subDir ? path.join(UPLOADS_DIR, subDir) : UPLOADS_DIR;
	const absolutePath = path.join(targetDir, filename);

	// Safety check: ensure the path is within uploads directory
	if (!absolutePath.startsWith(UPLOADS_DIR)) {
		throw new BadRequestError("Invalid image path");
	}

	// Check if file exists and delete
	if (fs.existsSync(absolutePath)) {
		fs.unlinkSync(absolutePath);
		return true;
	}

	return false;
};

/**
 * Update an image - deletes the old image and saves the new one
 * @param oldFilename - The old UUID filename to delete
 * @param newBase64Data - Base64 encoded new image data
 * @param subDir - Optional subdirectory within uploads
 * @returns The new UUID filename
 */
export const updateImage = (
	oldFilename: string | undefined,
	newBase64Data: string,
	subDir?: string,
): string => {
	// Delete old image if it exists
	if (oldFilename) {
		deleteImage(oldFilename, subDir);
	}

	// Save and return new image filename
	return saveBase64Image(newBase64Data, subDir);
};

/**
 * Check if a string is a valid base64 image
 */
export const isBase64Image = (str: string): boolean => {
	if (!str) return false;

	// Check for data URL format
	if (str.startsWith("data:image/")) {
		return true;
	}

	// Check if it looks like pure base64 (simplified check)
	const base64Regex = /^[A-Za-z0-9+/]+=*$/;
	return base64Regex.test(str.substring(0, 100)); // Check first 100 chars for efficiency
};

/**
 * File location URLs for different resource types
 * These URLs are used by frontend to construct the full image URL
 */
export interface FileLocations {
	courseImage?: string;
}

/**
 * Get the base URL for file uploads
 * Frontend can append the UUID filename to this URL to get the full image path
 * @param baseUrl - The base URL of the application (e.g., http://localhost:3000)
 * @returns Object containing file location URLs for different resource types
 */
export const getFileLocations = (baseUrl: string): FileLocations => {
	return {
		courseImage: `${baseUrl}/uploads/courses/`,
	};
};

/**
 * Build file locations object for API responses
 * @param baseUrl - The base URL of the application
 * @param includeTypes - Array of location types to include
 * @returns Partial file locations object
 */
export const buildFileLocations = (
	baseUrl: string,
	includeTypes: (keyof FileLocations)[],
): Partial<FileLocations> => {
	const allLocations = getFileLocations(baseUrl);
	const result: Partial<FileLocations> = {};

	for (const type of includeTypes) {
		if (allLocations[type]) {
			result[type] = allLocations[type];
		}
	}

	return result;
};
