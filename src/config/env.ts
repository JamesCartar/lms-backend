import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { ZodError, z } from "zod";

expand(config());

const EnvSchema = z.object({
	PORT: z.coerce.number().int().positive().default(3000),
	MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
	JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
	TRUSTED_ORIGINS: z.preprocess(
		(val) =>
			typeof val === "string" ? val.split(",").map((s) => s.trim()) : [],
		z.array(z.string()).min(1, "At least one TRUSTED_ORIGINS is required"),
	),

	// ✅ SMTP config
	SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),

	SMTP_PORT: z.coerce
		.number()
		.int()
		.positive()
		.refine(
			(port) => port === 465 || port === 587,
			"SMTP_PORT must be 465 or 587",
		),

	SMTP_EMAIL_AUTH_USER: z
		.string()
		.email("SMTP_EMAIL_AUTH_USER must be a valid email"),

	SMTP_EMAIL_PASSWORD: z.string().min(1, "SMTP_EMAIL_PASSWORD is required"),

	SMTP_FROM: z.string().min(1, "SMTP_FROM is required"),

	SALT_ROUNDS: z.coerce.number().int().positive().default(10),
});

export type Env = z.infer<typeof EnvSchema>;

let env: Env;
try {
	env = EnvSchema.parse(process.env);
} catch (error) {
	if (error instanceof ZodError) {
		let message = "❌ Invalid environment variables:\n";
		error.issues.forEach((issue) => {
			message += `  - ${issue.path[0]?.toString()}: ${issue.message}\n`;
		});
		const e = new Error(message);
		e.stack = "";
		throw e;
	} else {
		throw error;
	}
}

export { env };
