import type { AstroIntegration } from "astro";
import { envField } from "astro/config";
import { UserConfigSchema } from "./lib/schemas.ts";
import type { UserConfig } from "./lib/types.ts";
import { createVM } from "./lib/vite/virtual-module.ts";

export function integration(userConfig: UserConfig): AstroIntegration {
	const parsedUserConfig = UserConfigSchema.parse(userConfig);

	console.log(parsedUserConfig);

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
						plugins: [
							createVM("virtual:astro-resend-router/config", parsedUserConfig),
						],
					},
				});
				injectRoute({
					pattern: "/api/astro-resend-router",
					entrypoint: "astro-resend-router/api/astro-resend-router.ts",
					prerender: false,
				});
			},
		},
	};
}
