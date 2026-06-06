import { providers } from "virtual:astro-resend-router/providers";

for (const provider of providers) {
	const prov = provider.name;
	console.log(prov);
}
