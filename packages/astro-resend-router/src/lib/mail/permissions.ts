import { err } from "#/lib/api/index.ts";
import { fetchResendContact } from "#/lib/resend/index.ts";
import type { Result, ValidatedContext } from "#/lib/shared/types.ts";

import type { PermissionsError } from "./mail.types.ts";

export const verifyPermissions = async (
	ctx: ValidatedContext,
): Promise<Result<void, PermissionsError>> => {
	const email = ctx.requestFrom.toLowerCase();

	// Check for authorizedSenders configured in astro.config.mjs
	if (ctx.segment.authorizedSenders?.includes(email)) return { ok: true };

	// Check for authorized_sender === 'true' in contact properties on Resend
	const contact = await fetchResendContact(email);

	if (!contact.ok) return err(contact.error);

	if (contact?.value.properties?.authorized_sender?.value === "true")
		return { ok: true };

	return err({
		code: "unauthorized_sender",
		message: `Unauthorized sender: ${ctx.requestFrom}`,
		statusCode: 200,
	});
};
