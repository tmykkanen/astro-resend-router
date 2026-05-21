import type { APIRoute } from "astro";
import {
	errorResponse,
	successResponse,
	warn,
} from "../lib/astro-http-utils.ts";
import { handleBroadcast } from "../lib/handlers/broadcast.ts";
import { handleJoin } from "../lib/handlers/join.ts";
import { verifyPermissions } from "../lib/routing/permissions.ts";
import { parseRecipient } from "../lib/webhook/parse.ts";
import { validateTargets } from "../lib/webhook/validate.ts";
import { verifyWebhook } from "../lib/webhook/verify.ts";

export const GET: APIRoute = async () => {
	return successResponse("API Route is live at /api/astro-resend-router", 200);
};

export const POST: APIRoute = async ({ request }) => {
	try {
		// Verify webhook
		const verifiedWebhook = await verifyWebhook(request);
		if (!verifiedWebhook.ok) return verifiedWebhook.res;
		const { payload: verifiedPayload } = verifiedWebhook;

		// Guard clauses to ensure the event type is `email.received`
		if (verifiedPayload.type !== "email.received")
			return errorResponse(
				`Unhandled event type: ${verifiedPayload.type}`,
				200,
			);

		// Validate recipient presence
		const recipients = verifiedPayload.data.to;
		const recipient = recipients[0];
		if (!recipient)
			return errorResponse("Missing recipient email address", 400);
		if (recipients.length > 1) {
			warn(
				`Multiple recipients received; only processing first.\nRecipients: ${recipients}`,
			);
		}

		// Normalize sender & recipient address for consistent permission checks
		const sender = verifiedPayload.data.from.trim().toLowerCase();

		// Parse recipient for routing
		const parsed = parseRecipient(recipient);
		if (!parsed.ok) return parsed.res;

		// Validate segment / topic against user config and Resend data
		const validTargets = await validateTargets(parsed);
		if (!validTargets.ok) return validTargets.res;

		// Handle join action
		if (validTargets.action === "join")
			return validTargets.segment.allowPublicJoin
				? handleJoin(validTargets, sender)
				: errorResponse("Public join is disabled", 200);

		// Verify sender has broadcast permissions
		const verifiedPermissions = await verifyPermissions(validTargets, sender);
		if (!verifiedPermissions.ok) return verifiedPermissions.res;

		// Create and send broadcast
		return handleBroadcast(verifiedPayload.data.email_id, validTargets);
	} catch (err) {
		return errorResponse(`Unkown error: ${err}`, 500);
	}
};
