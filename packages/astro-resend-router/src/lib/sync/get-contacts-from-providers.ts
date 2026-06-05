import { err, ok } from "#/lib/api/index.ts";
import type { Result } from "#/lib/shared/types.ts";

import { CONTACT_PROVIDERS } from "./providers.ts";
import type {
	GetContactsFromProvidersError,
	GetContactsFromProvidersSuccess,
	SourceContact,
} from "./sync.types.ts";

export const getContactsFromProviders = async (): Promise<
	Result<GetContactsFromProvidersSuccess, GetContactsFromProvidersError>
> => {
	const results: SourceContact[] = [];

	for (const provider of CONTACT_PROVIDERS) {
		const res = await provider.getContacts();
		if (!res.ok) return err(res.error);

		results.push(...res.value);
	}

	return ok(Array.from(new Map(results.map((item) => [item.email, item]))));
};
