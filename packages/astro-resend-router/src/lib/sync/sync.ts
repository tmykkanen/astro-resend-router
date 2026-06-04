import { err, ok } from "#/lib/api/index.ts";
import { fetchResendContactsList } from "#/lib/resend/index.ts";

import type { SourceContact } from "./sync.types.ts";

export const syncContacts = async (sourceContacts: SourceContact[]) => {
	// * Fetch resend contact list
	//  TODO: Add config for segment specific sync - Should this come from the triggering function or from user settings?

	const resendContacts = await fetchResendContactsList();
	if (!resendContacts.ok) return err(resendContacts.error);

	// * Normalize resend contacts into lookup table w/ emails
	const resendLookup = new Map(
		resendContacts.value.data.map((entry) => [entry.email, entry]),
	);

	// * Filter out contacts already listed in Resend
	const contactsToSync = sourceContacts.filter(
		(contact) => !resendLookup.has(contact.email),
	);

	// # TESTING
	console.log(
		sourceContacts.filter((contact) => resendLookup.has(contact.email)),
	);

	// TODO: Create new contact in resend

	// # TEMP OK Return
	return ok(contactsToSync);
};
