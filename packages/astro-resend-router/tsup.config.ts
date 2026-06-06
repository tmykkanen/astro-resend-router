import { defineConfig } from "tsup";

import { peerDependencies } from "./package.json";

export default defineConfig((options) => {
	const dev = !!options.watch;
	return {
		entry: ["src/**/*.(ts|js)"],
		format: ["esm"],
		target: "node18",
		bundle: true,
		dts: true,
		sourcemap: true,
		clean: true,
		splitting: false,
		minify: !dev,
		external: [
			...Object.keys(peerDependencies),
			"virtual:astro-resend-router/config",
			"virtual:astro-resend-router/providers",
			"astro:env/server",
		],
		tsconfig: "tsconfig.json",
	};
});
