import config from "virtual:astro-resend-router/config";
import { providers } from "virtual:astro-resend-router/providers";
import type { APIRoute } from "astro";

import { successResponse } from "#/lib/api/response.ts";
// import { createResendContact } from "#/lib/resend/index.ts";
import type { ValidatedContext } from "#/lib/shared/types.ts";
import { getContactsFromProviders } from "#/lib/sync/get-contacts-from-providers.ts";
// import { syncContacts } from "#/lib/sync/index.ts";

export const GET: APIRoute = async () => {
	console.log("providers:", providers);

	for (const provider of providers) {
		console.log(provider.name);
		console.log(await provider.getContacts());
	}

	const mock_ctx: ValidatedContext = {
		action: "broadcast",
		requestFrom: "example@email.com",
		emailId: "string",
		segment: {
			segmentName: "Astro Resend Test",
			segmentSlug: "test",
			segmentId: "720e6fd0-85d1-4745-af43-e6c7e2851b4d",
			sendFromEmail: {
				name: "TEST",
				email: "test@example.com",
			},
			authorizedSenders: ["auth@example.com"],
			allowPublicJoin: true,
			syncContactsProviders: config.segments[0]?.syncContactsProviders ?? [],
			topics: [],
			customEmailFooter: "",
		},
	};

	console.log(await getContactsFromProviders(mock_ctx));

	// console.log(config.segments[0]?.syncContactsProviders);

	// const sync = await syncContacts(mock_ctx);
	// if (!sync.ok) return errorResponse(sync.error);

	// console.log(sync.value);
	// console.log(sync.value.length);
	//
	//

	// const firstName = "John";
	// const lastName = "Smith";
	// const source = "pco";

	// const res = await createResendContact({
	// 	email: mock_ctx.requestFrom,
	// 	firstName: firstName ?? "",
	// 	lastName: lastName ?? "",
	// 	source,
	// 	segment: { id: mock_ctx.segment.segmentId },
	// });

	// // TODO: Fix error responses to ensure more info is included
	// if (!res.ok) return errorResponse(res.error);

	return successResponse({
		code: "success",
		message: "Test success",
		statusCode: 200,
	});
};
