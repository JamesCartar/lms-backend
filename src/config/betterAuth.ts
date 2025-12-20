import { createHash } from "node:crypto";
import { memoryAdapter, type MemoryDB } from "better-auth/adapters/memory";
import { betterAuth } from "better-auth/minimal";
import { jwt } from "better-auth/plugins/jwt";
import { env } from "./env";
import type { JwtPayload } from "../types/jwt.types";

const authMemoryDb: MemoryDB = {
	account: [],
	audit: [],
	jwks: [],
	membership: [],
	organization: [],
	organizationAccount: [],
	organizationDomain: [],
	organizationInvitation: [],
	passkey: [],
	permission: [],
	role: [],
	session: [],
	twoFactor: [],
	user: [],
	verification: [],
	webauthnChallenge: [],
};

const secretByteLength = Buffer.byteLength(env.JWT_SECRET, "utf8");
const betterAuthSecret =
	secretByteLength >= 32
		? env.JWT_SECRET
		: createHash("sha256").update(env.JWT_SECRET).digest("hex");

const baseUrl = env.BASE_URL ?? `http://localhost:${env.PORT}`;

const auth = betterAuth({
	baseURL: baseUrl,
	secret: betterAuthSecret,
	database: memoryAdapter(authMemoryDb),
	plugins: [
		jwt({
			jwks: { rotationInterval: 86_400 },
			jwt: { expirationTime: "24h" },
		}),
	],
});

export const signAuthToken = async (
	payload: JwtPayload,
): Promise<string> => {
	const token = await auth.api.signJWT({
		body: {
			payload: {
				...payload,
				sub: payload.id,
			},
		},
	});

	return token.token;
};

export const verifyAuthToken = async (
	token: string,
): Promise<JwtPayload | null> => {
	try {
		const { payload } = await auth.api.verifyJWT({ body: { token } });
		if (!payload || typeof payload.sub !== "string") {
			return null;
		}
		if (payload.type !== "admin" && payload.type !== "student") {
			return null;
		}
		if (typeof payload.email !== "string") {
			return null;
		}

		return {
			id: payload.sub,
			email: payload.email,
			role: typeof payload.role === "string" ? payload.role : undefined,
			permissions: Array.isArray(payload.permissions)
				? payload.permissions.filter(
						(permission): permission is string =>
							typeof permission === "string",
					)
				: [],
			type: payload.type,
		};
	} catch (_error) {
		return null;
	}
};
