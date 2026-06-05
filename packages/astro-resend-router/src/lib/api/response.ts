import type { Status } from "#/lib/shared/types.ts";

import { log } from "./logging.ts";

type JSONResponse<T = unknown> = {
	code: string;
	message: string;
	data?: T;
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
 * Error response (logs + HTTP response)
 */
export const errorResponse = <C extends string>(error: Status<C>) => {
	log(`code: ${error.code} | message: ${error.message}`, "error");
	return jsonResponse(
		{
			code: error.code,
			message: error.message,
			...(error.details && { data: error.details }),
		},
		error.statusCode,
	);
};

/**
 * Success response (logs + HTTP response)
 */
export const successResponse = <C extends string>(value: Status<C>) => {
	log(`code: ${value.code} | message: ${value.message}`, "log");
	return jsonResponse(
		{
			code: value.code,
			message: value.message,
			...(value.details && { data: value.details }),
		},
		value.statusCode,
	);
};
