import { providers as customProviders } from "virtual:astro-resend-router/providers";

import { err, ok } from "#/lib/api/index.ts";
import type {
	Result,
	SourceContact,
	ValidatedContext,
} from "#/lib/shared/types.ts";

import { builtInProviders } from "./contact-providers.ts";
import type {
	GetContactsFromProvidersError,
	GetContactsFromProvidersSuccess,
} from "./sync.types.ts";

export const getContactsFromProviders = async (
	ctx: ValidatedContext,
): Promise<
	Result<GetContactsFromProvidersSuccess, GetContactsFromProvidersError>
> => {
	const results: SourceContact[] = [];

	const providers = ctx.segment.syncContactsProviders
		.map((provider) => {
			const builtIn = builtInProviders.find((p) => p.slug === provider);
			if (builtIn) return builtIn;

			const custom = customProviders.find((p) => p.slug === provider);
			if (custom) return custom;

			return "unknown_provider";
		})
		.filter((p) => p !== "unknown_provider");

	for (const provider of providers) {
		const res = await provider.getContacts();
		if (!res.ok) return err(res.error);

		results.push(...res.value);
	}

	return ok(Array.from(new Map(results.map((item) => [item.email, item]))));
};
