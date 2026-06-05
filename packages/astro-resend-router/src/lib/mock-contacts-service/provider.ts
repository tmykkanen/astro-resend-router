import { err, ok } from "#/lib/api/result.ts";
import type { ContactsProvider } from "#/lib/sync/index.ts";

import { getPeopleWithEmails } from "./get-people-with-emails.ts";

export const mockProvider: ContactsProvider = {
	name: "mock",
	getContacts: async () => {
		const res = await getPeopleWithEmails();

		if (!res.ok) {
			return err({
				code: "mock_get_error",
				message: res.error.message,
				statusCode: res.error.statusCode,
			});
		}

		return ok(res.value);
	},
};
