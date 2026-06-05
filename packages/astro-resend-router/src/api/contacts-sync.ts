import type { APIRoute } from "astro";

import { errorResponse, successResponse } from "#/lib/api/response.ts";
import { syncContacts } from "#/lib/sync/index.ts";

export const GET: APIRoute = async () => {
	const sync = await syncContacts();
	if (!sync.ok) return errorResponse(sync.error);

	// console.log(sync.value);
	console.log(sync.value.length);

	return successResponse({
		code: "success",
		message: "Test success",
		statusCode: 200,
	});
};
