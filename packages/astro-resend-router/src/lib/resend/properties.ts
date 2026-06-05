import { info } from "../api/index.ts";

const properties = [{ key: "source", type: "string" as const }];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const syncResendProperties = async (apiKey: string) => {
	const { Resend } = await import("resend");
	const resend = new Resend(apiKey);

	for (const p of properties) {
		const { error } = await resend.contactProperties.create(p);

		if (error && !error.message.includes("already")) {
			throw error;
		}

		await sleep(250);
	}

	info("Resend properties synced");
};
