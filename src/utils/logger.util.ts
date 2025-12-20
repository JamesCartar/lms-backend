export const logError = (message: string, error?: unknown): void => {
	if (error instanceof Error) {
		console.error(message, error.message);
		return;
	}

	if (error !== undefined) {
		console.error(message, error);
		return;
	}

	console.error(message);
};
