import { createHash } from "node:crypto";
import { memoryAdapter, type MemoryDB } from "better-auth/adapters/memory";
import { betterAuth } from "better-auth/minimal";
import { jwt } from "better-auth/plugins/jwt";
import { env } from "./env";
import type { JwtPayload } from "../types/jwt.types";

const ONE_DAY_IN_SECONDS = 24 * 60 * 60;

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
			jwks: { rotationInterval: ONE_DAY_IN_SECONDS },
			jwt: { expirationTime: "24h" },
		}),
	],
});

const mapVerifiedPayload = (payload: unknown): JwtPayload | null => {
	if (!payload || typeof payload !== "object") {
		return null;
	}

	const {
		sub,
		email,
		role,
		permissions,
		type,
	} = payload as Record<string, unknown>;

	if (typeof sub !== "string" || typeof email !== "string") {
		return null;
	}

	if (type !== "admin" && type !== "student") {
		return null;
	}

	const safePermissions = Array.isArray(permissions)
		? permissions.filter(
				(permission): permission is string =>
					typeof permission === "string",
			)
		: [];

	return {
		id: sub,
		email,
		role: typeof role === "string" ? role : undefined,
		permissions: safePermissions,
		type,
	};
};

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
		return mapVerifiedPayload(payload);
	} catch (_error) {
		return null;
	}
};
