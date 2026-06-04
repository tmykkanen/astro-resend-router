import type { AstroIntegration } from "astro";
import { envField } from "astro/config";

import { info, throwError } from "#/lib/api/index.ts";

import pkg from "../package.json";
import { createVM } from "./lib/config/create-virtual-module.ts";
import { UserConfigSchema } from "./lib/config/schema.ts";
import type { UserConfig } from "./lib/config/types.ts";

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
						},
					},
					vite: {
						define: {
							__VERSION__: JSON.stringify(pkg.version),
						},

						plugins: [createVM("virtual:astro-resend-router/config", config)],
					},
				});
				injectRoute({
					pattern: "/api/astro-resend-router",
					entrypoint: "astro-resend-router/api/astro-resend-router.ts",
					prerender: false,
				});
			},
			"astro:config:done": () => {
				info(
					"API endpoint successfully injected. Access at /api/astro-resend-router",
				);
			},
		},
	};
}
