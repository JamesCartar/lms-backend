import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { JwtPayload } from "../types/jwt.types";

const DEFAULT_OPTIONS: SignOptions = {
    algorithm: "HS256",
    issuer: "auth-service",
};

export function signJwt(payload: JwtPayload, options?: SignOptions) {
    return jwt.sign(payload satisfies JwtPayload, env.JWT_SECRET, {
        ...DEFAULT_OPTIONS,
        ...options,
    });
}

export function verifyJwt(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET, {
        algorithms: ["HS256"],
        issuer: DEFAULT_OPTIONS.issuer,
    }) as JwtPayload;
}
