import { z } from "astro/zod";

import { err, ok } from "#/lib/api/index.ts";
import type { Result } from "#/lib/shared/types.ts";

import { authHeaders } from "./auth.ts";
import { pco } from "./client.ts";
import type { EmailResult, FetchEmailsError } from "./pco.types.ts";
import { FetchEmailsResponseSchema } from "./schemas.ts";

export const fetchEmails = async (
	perPage = 100,
): Promise<Result<EmailResult[], FetchEmailsError>> => {
	let offset = 0;
	let hasMore = true;

	const emails: EmailResult[] = [];

	while (hasMore) {
		const { data, error } = await pco.GET("/emails", {
			params: {
				query: { per_page: perPage, offset: offset },
			},
			headers: authHeaders,
		});

		// Check if API Error
		if (error)
			return err({
				code: "pco_api_error",
				message: "PCO api returned error",
				statusCode: 500,
				details: error,
			});

		if (!data)
			return err({
				code: "pco_api_empty_response",
				message: "PCO api returned no data",
				statusCode: 502,
			});

		const parsed = FetchEmailsResponseSchema.safeParse(data);

		if (!parsed.success) {
			return err({
				code: "invalid_email_data",
				message: "PCO returned invalid data",
				statusCode: 502,
				details: {
					cause: z.treeifyError(parsed.error),
				},
			});
		}

		emails.push(...parsed.data.data);

		// pagination
		if (data.links?.next) {
			offset = offset + perPage;
		} else {
			hasMore = false;
		}
	}

	return ok(emails);
};
