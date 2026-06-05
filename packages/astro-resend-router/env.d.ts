/// <reference types="astro/client" />

declare module "astro:env/server" {
	export const RESEND_API_KEY: string;
	export const RESEND_WEBHOOK_SECRET: string;

	// * Add .env variables for sync providers here
	export const PCO_CLIENT_ID: string;
	export const PCO_SECRET: string;
}

declare module "virtual:astro-resend-router/config" {
	const config: import("./src/lib/config/config.schemas.ts").UserConfig;
	export default config;
}

declare const __VERSION__: string;
