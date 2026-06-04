import { AstroError } from "astro/errors";

const PREFIX = "[astro-resend-router]";

export const log = (
	message: string,
	level: "log" | "warn" | "error" = "log",
) => {
	console[level](`\x1b[34m${PREFIX}\x1b[0m ${message}`);
};

/**
 * Logs informational messages
 */
export const info = (message: string) => {
	log(message, "log");
};

/**
 * Logs warnings/errors without throwing
 */
export const warn = (message: string) => {
	log(message, "warn");
};

/**
 * Throws a standardized AstroError
 */
export const throwError = (message: string, hint: string): never => {
	throw new AstroError(`${PREFIX} ${message}`, hint);
};
