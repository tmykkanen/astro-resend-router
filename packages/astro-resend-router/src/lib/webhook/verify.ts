import { RESEND_WEBHOOK_SECRET } from "astro:env/server";
import { errorResponse } from "../astro-http-utils.ts";
import { resend } from "../resend.ts";
import type { VerifyWebhookResult } from "../types.ts";

export const verifyWebhook = async (
	request: Request,
): Promise<VerifyWebhookResult> => {
	// Get the raw payload for signature verification
	const payload = await request.text();

	// Extract Svix headers for verification
	const svixId = request.headers.get("svix-id");
	const svixTimestamp = request.headers.get("svix-timestamp");
	const svixSignature = request.headers.get("svix-signature");

	// Verify webhook signature (CRITICAL for security!)
	// Without this, attackers could send fake events to your endpoint
	if (!svixId || !svixTimestamp || !svixSignature) {
		return {
			ok: false,
			res: errorResponse("Missing Svix headers - rejecting webhook", 400),
		};
	}

	// Get the webhook secret from environment
	if (!RESEND_WEBHOOK_SECRET) {
		return {
			ok: false,
			res: errorResponse("RESEND_WEBHOOK_SECRET not configured", 400),
		};
	}

	// Verify the webhook signature
	try {
		const verified = resend.webhooks.verify({
			payload,
			headers: {
				id: svixId,
				timestamp: svixTimestamp,
				signature: svixSignature,
			},
			webhookSecret: RESEND_WEBHOOK_SECRET,
		});
		return { ok: true, payload: verified };
	} catch (err) {
		return {
			ok: false,
			res: errorResponse(`Webhook verification failed.\n${err}`, 400),
		};
	}
};
