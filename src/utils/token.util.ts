import crypto from "node:crypto";

const DEFAULT_TOKEN_BYTES = 32; // 256 bits

export function generateRandomToken(bytes = DEFAULT_TOKEN_BYTES) {
    return crypto.randomBytes(bytes).toString("base64url");
}

export function hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
}
