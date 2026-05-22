import type {
	PermissionsError,
	Result,
	ValidTargets,
} from "../contracts/types.ts";
import { resend } from "../resend.ts";

export const verifyPermissions = async (
	validTargets: ValidTargets,
	requestFrom: string,
): Promise<Result<void, PermissionsError>> => {
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
			error: {
				code: "fetch_remote_contacts_error",
				message: error.message,
				statusCode: error.statusCode ?? 500,
			},
		};

	if (contact?.properties?.authorized_sender?.value === "true")
		return { ok: true };

	return {
		ok: false,
		error: {
			code: "unauthorized_sender",
			message: `Unauthorized sender: ${requestFrom}`,
			statusCode: 200,
		},
	};
};
