/**
 * JWT Payload Interface
 */
export type JwtPurpose = "access" | "password_reset";

export type JwtPayload =
	| {
		purpose: "access";
		id: string;
		email: string;
		role?: string;
		permissions?: string[];
		type: "admin" | "student";
	}
	| {
		purpose: "password_reset";
		email: string;
		type: "admin" | "student";
		// no id here
	};

/**
 * Extend Express Request to include JWT payload
 */
declare global {
	namespace Express {
		interface Request {
			jwt?: JwtPayload;
		}
	}
}
