import type { Plugin } from "vite";

import type { UserConfig } from "./config.types.ts";

export function createVM(
	VIRTUAL_MODULE_ID: string,
	EXPORT: UserConfig,
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
				return `export default ${JSON.stringify(EXPORT)}`;
			},
		},
	};
}
