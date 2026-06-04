import type { APIRoute } from "astro";

import { errorResponse, successResponse } from "#/lib/api/response.ts";
import { getPeopleWithEmails } from "#/lib/planning-center/get-people-with-emails.ts";
import { syncContacts } from "#/lib/sync/index.ts";

export const GET: APIRoute = async () => {
	const peopleWithEmails = await getPeopleWithEmails();
	if (!peopleWithEmails.ok) return errorResponse(peopleWithEmails.error);

	const sync = await syncContacts(peopleWithEmails.value);
	if (!sync.ok) return errorResponse(sync.error);

	// console.log(sync.value);
	console.log(sync.value.length);

	return successResponse({
		code: "success",
		message: "Test success",
		statusCode: 200,
	});
};
