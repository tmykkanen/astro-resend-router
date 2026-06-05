import { err, ok } from "#/lib/api/index.ts";
import {
	createResendContact,
	fetchResendContactsList,
} from "#/lib/resend/index.ts";
import type { ValidatedContext } from "#/lib/shared/types.ts";

import { getContactsFromProviders } from "./get-contacts-from-providers.ts";

// TODO: Explictly type return
export const syncContacts = async (ctx: ValidatedContext) => {
	// * Get source contacts from providers
	const sourceContacts = await getContactsFromProviders();
	if (!sourceContacts.ok) return err(sourceContacts.error);

	// * Fetch resend contact list
	//  TODO: Add config for segment specific sync - Should this come from the triggering function or from user settings?
	const resendContacts = await fetchResendContactsList(ctx.segment.segmentId);
	if (!resendContacts.ok) return err(resendContacts.error);

	// * Normalize resend contacts into lookup table w/ emails
	const resendLookup = new Map(
		resendContacts.value.data.map((entry) => [entry.email, entry]),
	);

	// * Filter out contacts already listed in Resend
	const contactsToSync = sourceContacts.value.filter(
		(contact) => !resendLookup.has(contact[0]),
	);

	// # TESTING
	// console.log(
	// 	sourceContacts.value.filter((contact) => !resendLookup.has(contact[0])),
	// );

	for (const contact of contactsToSync) {
		const { email, firstName, lastName, source } = contact[1];

		const res = await createResendContact({
			email,
			firstName: firstName ?? "",
			lastName: lastName ?? "",
			source,
			segment: { id: ctx.segment.segmentId },
		});

		if (!res.ok) return err(res.error);
	}

	// # TEMP OK Return
	return ok(contactsToSync);
};
