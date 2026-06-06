import type { Result, SourceContact, Status } from "#/lib/shared/types.ts";

export type GetContactsFromProvidersError = Status<string>;
export type GetContactsFromProvidersSuccess = [string, SourceContact][];

export type ContactsProvider = {
	name: string;
	getContacts: () => Promise<
		Result<SourceContact[], GetContactsFromProvidersError>
	>;
};
