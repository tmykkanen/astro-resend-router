import { mockProvider } from "#/lib/mock-contacts-service/index.ts";
import { pcoProvider } from "#/lib/planning-center/index.ts";

export const CONTACT_PROVIDERS = [pcoProvider, mockProvider];

export const CONTACT_PROVIDER_MAP = Object.fromEntries(
	CONTACT_PROVIDERS.map((p) => [p.name, p]),
) as Record<
	(typeof CONTACT_PROVIDERS)[number]["name"],
	(typeof CONTACT_PROVIDERS)[number]
>;
