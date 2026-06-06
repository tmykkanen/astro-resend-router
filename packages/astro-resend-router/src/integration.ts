import type { AstroIntegration } from "astro";
import { envField } from "astro/config";

import { info, throwError } from "#/lib/api/index.ts";

import pkg from "../package.json";
import type { UserConfig } from "./lib/config/config.schemas.ts";
import { UserConfigSchema } from "./lib/config/config.schemas.ts";
import { createConfigVM } from "./lib/config/create-config-vm.ts";
import { createProvidersVM } from "./lib/config/create-providers-vm.ts";
import { syncResendProperties } from "./lib/resend/properties.ts";

export function integration(userConfig: UserConfig): AstroIntegration {
	if (userConfig === undefined) {
		return throwError(
			"Missing configuration",
			"You must configure resendRouter({segments: [...]}) — See https://github.com/tmykkanen/astro-resend-router/blob/main/packages/astro-resend-router/README.md",
		);
	}

	const parsedUserConfig = UserConfigSchema.safeParse(userConfig);

	if (!parsedUserConfig.success) {
		return throwError(
			"Invalid configuration — your integration config is missing required fields or is malformed.",
			`Issues:\n${parsedUserConfig.error.issues
				.map(
					(issue) => `  • ${issue.path.join(".") || "root"}: ${issue.message}`,
				)
				.join("\n")}`,
		);
	}

	const config = parsedUserConfig.data;

	return {
		name: "astro-resend-router",
		hooks: {
			"astro:config:setup": ({ updateConfig, injectRoute }) => {
				updateConfig({
					env: {
						schema: {
							RESEND_API_KEY: envField.string({
								context: "server",
								access: "secret",
							}),
							RESEND_WEBHOOK_SECRET: envField.string({
								context: "server",
								access: "secret",
							}),
							// * Add .env variables for sync providers here
							PCO_CLIENT_ID: envField.string({
								context: "server",
								access: "secret",
								optional: true,
							}),
							PCO_SECRET: envField.string({
								context: "server",
								access: "secret",
								optional: true,
							}),
						},
					},
					vite: {
						define: {
							__VERSION__: JSON.stringify(pkg.version),
						},

						plugins: [
							createConfigVM("virtual:astro-resend-router/config", config),
							createProvidersVM(
								"virtual:astro-resend-router/providers",
								config,
							),
						],
					},
				});
				injectRoute({
					pattern: "/api/astro-resend-router",
					entrypoint: "astro-resend-router/api/astro-resend-router.ts",
					prerender: false,
				});
				injectRoute({
					pattern: "/api/contacts-sync",
					entrypoint: "astro-resend-router/api/contacts-sync.ts",
					prerender: false,
				});
			},
			"astro:config:done": async () => {
				// Set up Resend properties
				const { loadEnv } = await import("vite");

				const env = loadEnv(
					process.env.NODE_ENV ?? "development",
					process.cwd(),
					"", // prefix — '' loads ALL vars, 'PUBLIC_' loads only public ones
				);

				const apiKey = env.RESEND_API_KEY;
				if (!apiKey) throw new Error("Missing RESEND_API_KEY");

				await syncResendProperties(apiKey);

				info(
					"API endpoint successfully injected. Access at /api/astro-resend-router",
				);
			},
		},
	};
}
