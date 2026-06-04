import type { APIRoute } from "astro";

import { errorResponse } from "#/lib/api/index.ts";
// import { syncContacts } from "#/lib/sync/sync.ts";
import { fetchEmails } from "#/lib/planning-center/fetch-emails.ts";
import { fetchPeople } from "#/lib/planning-center/fetch-people.ts";
import { hydratePeopleWithEmails } from "#/lib/planning-center/hydrate-people-with-emails.ts";
import { fetchResendContactsList } from "#/lib/resend/contacts.ts";

export const GET: APIRoute = async () => {
	const people = await fetchPeople();
	if (!people.ok) return errorResponse(people.error);

	const emails = await fetchEmails();
	if (!emails.ok) return errorResponse(emails.error);

	const hydrated = hydratePeopleWithEmails(people.value, emails.value);

	const contactsLookup = new Map(hydrated.map((entry) => [entry.email, entry]));

	console.log(contactsLookup.entries());

	// - Fetch resend contact list
	const resendContacts = await fetchResendContactsList();
	if (!resendContacts.ok) return errorResponse(resendContacts.error);

	console.log(resendContacts.value.data);

	const resendLookup = new Map(
		resendContacts.value.data.map((entry) => [entry.email, entry]),
	);

	console.log(resendLookup.entries());

	return new Response(JSON.stringify(contactsLookup.get("example@email.com")), {
		status: 200,
	});
};
