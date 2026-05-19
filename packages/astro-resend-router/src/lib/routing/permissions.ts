import config from "virtual:astro-resend-router/config";
import { errorResponse } from "../errors.ts";
import { resend } from "../resend.ts";
import type { VerifyPermissionsResult } from "../types.ts";

export const verifyPermissions = async (
	requestFrom: string,
): Promise<VerifyPermissionsResult> => {
	const email = requestFrom.toLowerCase();

	// 1. authorizedSenders configured in astro.config.mjs
	if (config.authorizedSenders?.includes(email)) return { ok: true };

	// 2. Check for authorized_sender === 'true' in contact properties on Resend
	const { data: contact, error } = await resend.contacts.get({
		email: requestFrom,
	});

	if (error)
		return {
			ok: false,
			res: errorResponse(error.message, error.statusCode ?? 500),
		};

	if (contact?.properties?.authorized_sender?.value === "true")
		return { ok: true };

	return {
		ok: false,
		res: errorResponse(`Unauthorized sender: ${requestFrom}`, 200),
	};
};
