// These must be in a separate file from the other provider config due to use in zod schema at build time
export const CONTACT_PROVIDER_NAMES = ["pco", "mock"] as const;
export type ContactProviderName = (typeof CONTACT_PROVIDER_NAMES)[number];
