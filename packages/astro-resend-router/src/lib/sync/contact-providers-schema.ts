// These must be in a separate file from the other provider config due to use in zod schema at build time
export const builtInProviderNames = ["pco", "mock"] as const;
export type BuiltInProviderName = (typeof builtInProviderNames)[number];
