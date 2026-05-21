import { errorResponse } from "../astro-http-utils.ts";
import { resend } from "../resend.ts";
import type {
	ValidateTargetsSuccess,
	VerifyPermissionsResult,
} from "../types.ts";

export const verifyPermissions = async (
	validTargets: ValidateTargetsSuccess,
	requestFrom: string,
): Promise<VerifyPermissionsResult> => {
	const email = requestFrom.toLowerCase();

	// Check for authorizedSenders configured in astro.config.mjs
	if (validTargets.segment.authorizedSenders?.includes(email))
		return { ok: true };

	// Check for authorized_sender === 'true' in contact properties on Resend
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
