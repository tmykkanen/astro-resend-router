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

declare module "virtual:astro-resend-router/providers" {
	type OkResult<Success> = Success extends void
		? { ok: true }
		: { ok: true; value: Success };
	type ErrResult<Error> = Error extends void
		? { ok: false }
		: { ok: false; error: Error };

	type Result<Success, Error> = OkResult<Success> | ErrResult<Error>;

	export type SourceContact = {
		email: string;
		firstName?: string;
		lastName?: string;
		source: string;
	};

	export type Status<C extends string> = {
		code: C;
		message: string;
		statusCode: number;
		details?: Record<string, unknown>;
	};

	export type GetContactsFromProvidersError = Status<string>;

	type ContactsProvider = {
		slug: string;
		getContacts: () => Promise<
			Result<SourceContact[], GetContactsFromProvidersError>
		>;
	};

	export const providers: ContactsProvider[];
}

declare const __VERSION__: string;
