import { err, ok } from "#/lib/api/index.ts";
import type { Result } from "#/lib/shared/types.ts";

import type { ContactProviderName } from "./providers.names.ts";
import { CONTACT_PROVIDER_MAP } from "./providers.ts";
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
		const provider = CONTACT_PROVIDER_MAP[item];
		const res = await provider.getContacts();
		if (!res.ok) return err(res.error);

		results.push(...res.value);
	}

	return ok(Array.from(new Map(results.map((item) => [item.email, item]))));
};
