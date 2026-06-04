import type { Status } from "#/lib/shared/types.ts";

import { log } from "./logging.ts";

type JSONResponse<T = unknown> = {
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
	log(error.message, "error");
	return jsonResponse(
		{ message: error.message, data: error.details ?? "" },
		error.statusCode,
	);
};

/**
 * Success response (logs + HTTP response)
 */
export const successResponse = <C extends string>(value: Status<C>) => {
	log(value.message, "log");
	return jsonResponse({ message: value.message }, value.statusCode);
};
