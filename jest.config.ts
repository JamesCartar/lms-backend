import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/src"],
	testMatch: ["**/*.test.ts"],
	moduleFileExtensions: ["ts", "js", "json"],
	clearMocks: true,
	coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.jest.json",
			},
		],
	},
};

export default config;
