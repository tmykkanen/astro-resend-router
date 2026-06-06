// These must be in a separate file from the other provider config due to use in zod schema at build time
export const contactProviderNames = ["pco", "mock"] as const;
export type ContactProviderName = (typeof contactProviderNames)[number];
