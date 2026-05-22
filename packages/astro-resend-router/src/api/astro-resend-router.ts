import { RESEND_WEBHOOK_SECRET } from "astro:env/server";
import type { APIRoute } from "astro";
import { handleExecution } from "../lib/execute/execute.ts";
import { parseContext } from "../lib/parse.ts";
import {
	endpointStatus,
	markRequestReceived,
	serverStatus,
	webhookStatus,
} from "../lib/utils/api-status.ts";
import {
	errorResponse,
	successResponse,
} from "../lib/utils/astro-http-utils.ts";
import { validateTargets } from "../lib/validate.ts";
import { verifyWebhook } from "../lib/verify.ts";

export const GET: APIRoute = async () => {
	return new Response(
		JSON.stringify({
			message: "Astro Resend Router Status",
			webhook: {
				configured: Boolean(RESEND_WEBHOOK_SECRET),
				lastEvent: webhookStatus.lastEvent,
				lastStatus: endpointStatus.ok
					? "success"
					: endpointStatus.lastRequestAt
						? "error"
						: "unknown",
			},
			endpoint: {
				route: "/api/astro-resend-router",
				startedAt: serverStatus.startedAt,
				uptimeMs: Date.now() - serverStatus.startedAtMs,
				lastRequestAt: endpointStatus.lastRequestAt,
				lastResponseAt: endpointStatus.lastResponseAt,
				lastResponse: endpointStatus.lastResponse,
			},
		}),
		{ status: 200 },
	);
};

export const POST: APIRoute = async ({ request }) => {
	try {
		// 0. Status update
		markRequestReceived();

		// 1. Verify webhook
		const verified = await verifyWebhook(request);
		if (!verified.ok) return errorResponse(verified.error);

		// 2. Parse recipient for routing
		const parsed = parseContext(verified.value);
		if (!parsed.ok) return errorResponse(parsed.error);

		// 3. Validate segment / topic against user config and Resend data
		const validated = await validateTargets(parsed.value);
		if (!validated.ok) return errorResponse(validated.error);

		// 4. Handle Execution
		const executed = await handleExecution(parsed.value, validated.value);
		if (!executed.ok) return errorResponse(executed.error);

		return successResponse(executed.value);
	} catch (err) {
		return errorResponse({
			code: "unknown_error",
			message: `Unknown error: ${err}`,
			statusCode: 500,
		});
	}
};
