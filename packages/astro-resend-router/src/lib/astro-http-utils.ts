import { AstroError } from "astro/errors";
import pc from "picocolors";

const PREFIX = "[astro-resend-router]";

type JSONResponse<T = unknown> = {
	message: string;
	data?: T;
};

const log = (message: string, level: "log" | "warn" | "error" = "log") => {
	console[level](`${pc.blue(PREFIX)} ${message}`);
};

/**
 * Core response helper
 */
const jsonResponse = <T>(payload: JSONResponse<T>, status: number) => {
	return new Response(JSON.stringify(payload), {
		status,
		headers: {
			"Content-Type": "application/json",
		},
	});
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

/**
 * Error response (logs + HTTP response)
 */
export const errorResponse = (message: string, status = 400) => {
	log(message, "error");
	return jsonResponse({ message }, status);
};

/**
 * Success response (logs + HTTP response)
 */
export const successResponse = <T>(message: string, data?: T, status = 200) => {
	log(message, "log");
	return jsonResponse({ message, data }, status);
};
