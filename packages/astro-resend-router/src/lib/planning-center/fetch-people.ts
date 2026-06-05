import { z } from "astro/zod";

import { err, ok } from "#/lib/api/index.ts";
import type { Result } from "#/lib/shared/types.ts";

import { useAuth } from "./auth.ts";
import { pco } from "./client.ts";
import { FetchPeopleResponseSchema } from "./pco.schemas.ts";
import type { FetchPeopleError, PersonResult } from "./pco.types.ts";

export const fetchPeople = async (
	perPage = 100,
): Promise<Result<PersonResult[], FetchPeopleError>> => {
	let offset = 0;
	let hasMore = true;

	const people: PersonResult[] = [];

	while (hasMore) {
		const { data, error } = await pco.GET("/people", {
			params: {
				query: { per_page: perPage, offset: offset },
			},
			headers: useAuth(),
		});

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

		const parsed = FetchPeopleResponseSchema.safeParse(data);

		if (!parsed.success) {
			return err({
				code: "invalid_people_data",
				message: "PCO returned invalid data",
				statusCode: 502,
				details: {
					cause: z.treeifyError(parsed.error),
				},
			});
		}

		people.push(...parsed.data.data);

		// pagination
		if (data.links?.next) {
			offset = offset + perPage;
		} else {
			hasMore = false;
		}
	}

	return ok(people);
};
