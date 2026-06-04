import { err, ok } from "#/lib/api/index.ts";
import {
	fetchEmails,
	fetchPeople,
	hydratePeopleWithEmails,
} from "#/lib/planning-center/index.ts";
import { fetchResendContactsList } from "#/lib/resend/index.ts";

export const syncContacts = async () => {
	// * Fetch People and Emails from PCO
	const pcoPeople = await fetchPeople();
	if (!pcoPeople.ok) return err(pcoPeople.error);

	const pcoEmails = await fetchEmails();
	if (!pcoEmails.ok) return err(pcoEmails.error);

	// * Normalize into People object w/ id, name, email and last updated
	const pcoHydratedContacts = hydratePeopleWithEmails(
		pcoPeople.value,
		pcoEmails.value,
	);

	// * Fetch resend contact list
	//  TODO: Add config for segment specific sync - Should this come from the triggering function or from user settings?

	const resendContacts = await fetchResendContactsList();
	if (!resendContacts.ok) return err(resendContacts.error);

	// * Normalize resend contacts into lookup table w/ emails
	const resendLookup = new Map(
		resendContacts.value.data.map((entry) => [entry.email, entry]),
	);

	// * Filter out contacts already listed in Resend
	const contactsToSync = pcoHydratedContacts.filter(
		(contact) => !resendLookup.has(contact.email),
	);

	// TODO: Create new contact in resend

	// # TEMP OK Return
	return ok(contactsToSync);
};
