import config from "virtual:astro-resend-router/config";
import { errorResponse } from "../errors.ts";
import type { ParseRecipientResult } from "../types.ts";

export const parseRecipient = (recipient: string): ParseRecipientResult => {
	const parts = recipient
		.split("@")[0]
		?.trim()
		.toLowerCase()
		?.split(".")
		.filter(Boolean);

	if (!parts?.length)
		return {
			ok: false,
			res: errorResponse("Missing recipient information", 400),
		};

	// Ignores anything after the first three parts
	const [p0, p1, p2] = parts;

	if (!p0)
		return {
			ok: false,
			res: errorResponse("Missing recipient information", 400),
		};

	if (p0 === "join") {
		return config.allowPublicJoin
			? {
					ok: true,
					action: p0,
					...(p1 && { segment: p1 }),
					...(p2 && { topic: p2 }),
				}
			: {
					ok: false,
					res: errorResponse("Public join is disabled.", 403),
				};
	}

	return {
		ok: true,
		segment: p0,
		...(p1 && { topic: p1 }),
	};
};
