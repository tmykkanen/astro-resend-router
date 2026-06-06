import type { Plugin } from "vite";

import type { UserConfig } from "./config.schemas.ts";

export function createProvidersVM(
	VIRTUAL_MODULE_ID: string,
	CONFIG: UserConfig,
): Plugin {
	const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

	return {
		name: VIRTUAL_MODULE_ID,
		resolveId: {
			filter: {
				id: new RegExp(`^${VIRTUAL_MODULE_ID}$`),
			},
			handler() {
				return RESOLVED_VIRTUAL_MODULE_ID;
			},
		},
		load: {
			filter: {
				id: new RegExp(`^${RESOLVED_VIRTUAL_MODULE_ID}$`),
			},
			handler() {
				const imports = CONFIG.customSyncProviders
					.map(
						(provider, i) =>
							`import {provider as provider${i}} from ${JSON.stringify(provider)};`,
					)
					.join("\n");

				const exports = CONFIG.customSyncProviders
					.map((_, i) => `provider${i}`)
					.join(", ");

				console.log(imports);
				console.log(exports);
				console.log(process.env.PWD);

				return `
        ${imports}

        export const providers = [${exports}];
        `;
			},
		},
	};
}
