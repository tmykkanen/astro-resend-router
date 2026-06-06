import { RESEND_WEBHOOK_SECRET } from "astro:env/server";

import { err, ok } from "#/lib/api/index.ts";
import type { Result } from "#/lib/shared/types.ts";

import { resend } from "./client.ts";
import type { VerifyError, VerifySuccess } from "./resend.types.ts";

export const verifyResendWebhook = async (
	request: Request,
): Promise<Result<VerifySuccess, VerifyError>> => {
	// Get the raw payload for signature verification
	const payload = await request.text();

	// Extract Svix headers for verification
	const svixId = request.headers.get("svix-id");
	const svixTimestamp = request.headers.get("svix-timestamp");
	const svixSignature = request.headers.get("svix-signature");

	// Verify webhook signature (CRITICAL for security!)
	// Without this, attackers could send fake events to your endpoint
	if (!svixId || !svixTimestamp || !svixSignature)
		return err({
			code: "missing_svix_headers",
			message: "Missing Svix headers - rejecting webhook",
			statusCode: 400,
		});

	// Get the webhook secret from environment
	if (!RESEND_WEBHOOK_SECRET)
		return err({
			code: "missing_webhook_secret",
			message: "RESEND_WEBHOOK_SECRET not configured",
			statusCode: 400,
		});

	// Verify the webhook signature
	try {
		const webhookEventPayload = resend.webhooks.verify({
			payload,
			headers: {
				id: svixId,
				timestamp: svixTimestamp,
				signature: svixSignature,
			},
			webhookSecret: RESEND_WEBHOOK_SECRET,
		});

		// Guard clauses to ensure the event type is `email.received`
		if (webhookEventPayload.type !== "email.received")
			return err({
				code: "unhandled_webhook_event_type",
				statusCode: 200,
				message: `Unhandled event type: ${webhookEventPayload.type}`,
			});

		return ok(webhookEventPayload);
	} catch (error) {
		return err({
			code: "unknown_webhook_verification_error",
			message: `Webhook verification failed.\n${error}`,
			statusCode: 400,
		});
	}
};
