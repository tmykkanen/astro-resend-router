import type { APIRoute } from "astro";

import { errorResponse, successResponse } from "#/lib/api/response.ts";
import type { ValidatedContext } from "#/lib/shared/types.ts";
import { syncContacts } from "#/lib/sync/index.ts";

export const GET: APIRoute = async () => {
	const mock_ctx: ValidatedContext = {
		action: "broadcast",
		requestFrom: "example@email.com",
		emailId: "string",
		segment: {
			segmentName: "Astro Resend Test",
			segmentIdentifier: "test",
			segmentId: "720e6fd0-85d1-4745-af43-e6c7e2851b4d",
			sendFromEmail: {
				name: "TEST",
				email: "test@example.com",
			},
			authorizedSenders: ["auth@example.com"],
			allowPublicJoin: true,
			syncContacts: true,
			topics: [],
			customEmailFooter: "",
		},
	};

	const sync = await syncContacts(mock_ctx);
	if (!sync.ok) return errorResponse(sync.error);

	// console.log(sync.value);
	console.log(sync.value.length);

	return successResponse({
		code: "success",
		message: "Test success",
		statusCode: 200,
	});
};
