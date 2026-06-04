import type { Status } from "#/lib/shared/types.ts";

import type { APIHealth, APIStatusCache } from "./api.types.ts";

export const reportHealth = (
	API_STATUS_CACHE: APIStatusCache,
	route: string,
	message = "API Status",
) => {
	const body: APIHealth = {
		message,
		route,
		status: API_STATUS_CACHE,
		timestamp: Date.now(),
		uptime_seconds: Math.floor(process.uptime()),
		version: __VERSION__,
	};

	return new Response(JSON.stringify(body), { status: 200 });
};

export const updateAPIStatus = (
	API_STATUS_CACHE: APIStatusCache,
	status: Status<string>,
): void => {
	API_STATUS_CACHE.lastStatusUpdate = {
		timestamp: Date.now(),
		code: status.code,
		statusCode: status.statusCode,
	};
};
