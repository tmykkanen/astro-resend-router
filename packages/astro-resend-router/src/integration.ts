import type { AstroIntegration } from "astro";
import { envField } from "astro/config";
import { AstroError } from "astro/errors";
import { UserConfigSchema } from "./lib/schemas.ts";
import type { UserConfig } from "./lib/types.ts";
import { createVM } from "./lib/vite/virtual-module.ts";

export function integration(userConfig: UserConfig): AstroIntegration {
	if (userConfig === undefined) {
		throw new AstroError(
			"[astro-resend-router] Missing configuration",
			`Did you forget to call the integration?

         🤦‍♂️ Incorrect:
         resendRouter

         ✅ Correct:
         resendRouter({
           segments: [...]
         })`,
		);
	}

	const parsedUserConfig = UserConfigSchema.safeParse(userConfig);

	if (!parsedUserConfig.success) {
		throw new AstroError(
			"[astro-resend-router] Invalid configuration — your integration config is missing required fields or is malformed.",
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
			"astro:config:done": ({ logger }) => {
				logger.info(
					"API endpoint successfully injected. Access at /api/astro-resend-router",
				);
			},
		},
	};
}
