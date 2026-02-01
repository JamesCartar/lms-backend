import type { NextFunction, Request, Response } from "express";
import { AuditLogService } from "../services/auditlog.service";

/**
 * Response data structure that may contain an ID
 */
interface ResponseData {
	data?: {
		_id?: unknown;
	};
}

/**
 * Save History Middleware
 * Records audit logs for POST, PUT, DELETE operations
 * Should be applied after authentication middleware
 */
export const saveHistory = (resource: string) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		// Store original send function
		const originalSend = res.json;

		// Override send function to capture response
		res.json = function (data: ResponseData) {
			// ✅ Only log if the request was successful (2xx) AND token is an ACCESS token
			if (
				res.statusCode >= 200 &&
				res.statusCode < 300 &&
				req.jwt?.purpose === "access"
			) {
				const auditLogService = new AuditLogService();

				// Determine action based on HTTP method
				let action: "CREATE" | "UPDATE" | "DELETE";
				if (req.method === "POST") {
					action = "CREATE";
				} else if (req.method === "PUT" || req.method === "PATCH") {
					action = "UPDATE";
				} else if (req.method === "DELETE") {
					action = "DELETE";
				} else {
					// Skip logging for other methods
					return originalSend.call(this, data);
				}

				// Get resource ID from params or response data
				const resourceId = req.params.id || data?.data?._id;

				// Create audit log asynchronously (don't block response)
				auditLogService
					.createAuditLog({
						userId: req.jwt.id, // ✅ safe because purpose === "access"
						userType: req.jwt.type,
						email: req.jwt.email,
						action,
						resource,
						resourceId: resourceId?.toString(),
						changes: req.body,
						ip: req.ip || req.socket.remoteAddress,
						userAgent: req.get("user-agent"),
					})
					.catch((error) => {
						// Log error but don't fail the request
						console.error("Failed to create audit log:", error);
					});
			}

			// Call original send function
			return originalSend.call(this, data);
		};

		next();
	};
};
