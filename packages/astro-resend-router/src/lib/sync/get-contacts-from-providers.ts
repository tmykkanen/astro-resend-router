import { err, ok } from "#/lib/api/index.ts";
import type { Result } from "#/lib/shared/types.ts";

import { contactProviderMap } from "./contact-providers.ts";
import type { ContactProviderName } from "./contact-providers-schema.ts";
import type {
	GetContactsFromProvidersError,
	GetContactsFromProvidersSuccess,
	SourceContact,
} from "./sync.types.ts";

export const getContactsFromProviders = async (
	providers: ContactProviderName[],
): Promise<
	Result<GetContactsFromProvidersSuccess, GetContactsFromProvidersError>
> => {
	const results: SourceContact[] = [];

	for (const item of providers) {
		const provider = contactProviderMap[item];
		const res = await provider.getContacts();
		if (!res.ok) return err(res.error);

		results.push(...res.value);
	}

	return ok(Array.from(new Map(results.map((item) => [item.email, item]))));
};
