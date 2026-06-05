import type { Result, Status } from "#/lib/shared/types.ts";

export type SourceContact = {
	email: string;
	firstName?: string;
	lastName?: string;
	source: string;
};

export type GetContactsFromProvidersError = Status<string>;
export type GetContactsFromProvidersSuccess = [string, SourceContact][];

export type ContactsProvider = {
	name: string;
	getContacts: () => Promise<
		Result<SourceContact[], GetContactsFromProvidersError>
	>;
};
