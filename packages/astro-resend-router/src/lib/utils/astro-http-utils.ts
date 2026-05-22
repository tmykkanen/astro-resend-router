import { AstroError } from "astro/errors";
import pc from "picocolors";
import type {
	ExecutionError,
	ExecutionResult,
	ParseError,
	UnknownError,
	ValidationError,
	VerifyError,
} from "../contracts/types.ts";
import { markResponseSent } from "./api-status.ts";

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
export const errorResponse = (
	error:
		| VerifyError
		| ParseError
		| ValidationError
		| ExecutionError
		| UnknownError,
) => {
	log(error.message, "error");
	markResponseSent(false, error.code, error.statusCode);
	return jsonResponse({ message: error.message }, error.statusCode);
};

/**
 * Success response (logs + HTTP response)
 */
export const successResponse = (value: ExecutionResult) => {
	log(value.message, "log");
	markResponseSent(true, value.code, value.statusCode);
	return jsonResponse({ message: value.message }, value.statusCode);
};
