import { RESEND_WEBHOOK_SECRET } from "astro:env/server";
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
		console.warn("Missing Svix headers - rejecting webhook");
		return {
			ok: false,
			res: new Response(
				JSON.stringify({ error: "Missing webhook signature headers" }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			),
		};
	}

	// Get the webhook secret from environment
	if (!RESEND_WEBHOOK_SECRET) {
		console.error("RESEND_WEBHOOK_SECRET not configured");
		return {
			ok: false,
			res: new Response(
				JSON.stringify({ error: "Webhook secret not configured" }),
				{ status: 500, headers: { "Content-Type": "application/json" } },
			),
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
		console.error("Webhook verification failed:", err);
		return {
			ok: false,
			res: new Response(
				JSON.stringify({ error: "Invalid webhook signature" }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			),
		};
	}
};
