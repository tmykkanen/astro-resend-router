import { mockProvider } from "#/lib/mock-contacts-service/index.ts";
import { pcoProvider } from "#/lib/planning-center/index.ts";

export const contactProviders = [pcoProvider, mockProvider];

export const contactProviderMap = Object.fromEntries(
	contactProviders.map((p) => [p.name, p]),
) as Record<
	(typeof contactProviders)[number]["name"],
	(typeof contactProviders)[number]
>;
