/**
 * JWT Payload Interface
 */
export interface JwtPayload {
  id: string;
  email: string;
  role?: string;
  permissions?: string[];
  type: 'admin' | 'student';
}

/**
 * Extend Express Request to include JWT payload
 */
declare global {
  namespace Express {
    interface Request {
      jwt?: JwtPayload;
      user?: any;
    }
  }
}

export {};
