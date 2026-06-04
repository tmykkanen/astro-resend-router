import { err } from "#/lib/api/index.ts";
import { fetchResendContact } from "#/lib/resend/index.ts";
import type { Result } from "#/lib/shared/types.ts";

import type { PermissionsError, ValidationSuccess } from "./mail.types.ts";

export const verifyPermissions = async (
	validTargets: ValidationSuccess,
	requestFrom: string,
): Promise<Result<void, PermissionsError>> => {
	const email = requestFrom.toLowerCase();

	// Check for authorizedSenders configured in astro.config.mjs
	if (validTargets.segment.authorizedSenders?.includes(email))
		return { ok: true };

	// Check for authorized_sender === 'true' in contact properties on Resend
	const contact = await fetchResendContact(email);

	if (!contact.ok) return err(contact.error);

	if (contact?.value.properties?.authorized_sender?.value === "true")
		return { ok: true };

	return err({
		code: "unauthorized_sender",
		message: `Unauthorized sender: ${requestFrom}`,
		statusCode: 200,
	});
};
