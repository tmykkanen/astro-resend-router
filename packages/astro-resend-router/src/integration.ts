import type { AstroIntegration } from "astro";
import { envField } from "astro/config";
import { info, throwError } from "./lib/astro-http-utils.ts";
import { UserConfigSchema } from "./lib/schemas.ts";
import type { UserConfig } from "./lib/types.ts";
import { createVM } from "./lib/vite/virtual-module.ts";

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
