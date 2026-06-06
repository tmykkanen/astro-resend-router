import { err, ok } from "#/lib/api/result.ts";
import type { ContactsProvider } from "#/lib/sync/index.ts";

import { getPeopleWithEmails } from "./get-people-with-emails.ts";

export const pcoProvider = {
	slug: "pco",
	getContacts: async () => {
		const res = await getPeopleWithEmails();

		if (!res.ok) {
			return err({
				code: "pco_get_error",
				message: res.error.message,
				statusCode: res.error.statusCode,
			});
		}

		return ok(res.value);
	},
} as const satisfies ContactsProvider;
