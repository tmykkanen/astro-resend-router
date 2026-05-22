import { RESEND_WEBHOOK_SECRET } from "astro:env/server";
import type { EmailReceivedEvent } from "resend";
import type { Result, VerifyError } from "./contracts/types.ts";
import { resend } from "./resend.ts";

export const verifyWebhook = async (
	request: Request,
): Promise<Result<EmailReceivedEvent, VerifyError>> => {
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
			error: {
				code: "missing_svix_headers",
				message: "Missing Svix headers - rejecting webhook",
				statusCode: 400,
				details: {
					svixId: Boolean(svixId),
					svixTimestamp: Boolean(svixTimestamp),
					svixSignature: Boolean(svixSignature),
				},
			},
		};
	}

	// Get the webhook secret from environment
	if (!RESEND_WEBHOOK_SECRET) {
		return {
			ok: false,
			error: {
				code: "missing_webhook_secret",
				message: "RESEND_WEBHOOK_SECRET not configured",
				statusCode: 400,
			},
		};
	}

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
			return {
				ok: false,
				error: {
					code: "unhandled_webhook_event_type",
					statusCode: 200,
					message: `Unhandled event type: ${webhookEventPayload.type}`,
				},
			};

		return { ok: true, value: webhookEventPayload };
	} catch (err) {
		return {
			ok: false,
			error: {
				code: "unknown_webhook_verification_error",
				message: `Webhook verification failed.\n${err}`,
				statusCode: 400,
			},
		};
	}
};
