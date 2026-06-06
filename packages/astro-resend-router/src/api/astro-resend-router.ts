import type { APIRoute } from "astro";

import type { APIStatusCache } from "#/lib/api/index.ts";
import {
	errorResponse,
	reportHealth,
	successResponse,
	updateAPIStatus,
} from "#/lib/api/index.ts";
import {
	parseContext,
	routeAction,
	validateTargets,
} from "#/lib/mail/index.ts";
import { verifyResendWebhook } from "#/lib/resend/index.ts";

// CACHE API STATUS IN MEMORY
const API_STATUS_CACHE: APIStatusCache = {
	ok: false,
	lastStatusUpdate: {
		timestamp: Date.now(),
		code: null,
		statusCode: null,
	},
};

export const GET: APIRoute = async ({ url }) => {
	return reportHealth(API_STATUS_CACHE, url.pathname);
};

export const POST: APIRoute = async ({ request }) => {
	try {
		// 1. Verify webhook
		const verified = await verifyResendWebhook(request);

		if (!verified.ok) {
			const { error } = verified;
			updateAPIStatus(API_STATUS_CACHE, error);
			return errorResponse(error);
		}

		// 2. Parse recipient for routing
		const parsed = parseContext(verified.value);
		if (!parsed.ok) {
			const { error } = parsed;
			updateAPIStatus(API_STATUS_CACHE, error);
			return errorResponse(error);
		}

		// 3. Validate segment / topic against user config and Resend data
		const validated = await validateTargets(parsed.value);
		if (!validated.ok) {
			const { error } = validated;
			updateAPIStatus(API_STATUS_CACHE, error);
			return errorResponse(error);
		}

		// 4. Handle Execution
		const executed = await routeAction(validated.value);
		if (!executed.ok) {
			const { error } = executed;
			updateAPIStatus(API_STATUS_CACHE, error);
			return errorResponse(error);
		}

		updateAPIStatus(API_STATUS_CACHE, executed.value);
		return successResponse(executed.value);
	} catch (err) {
		return errorResponse({
			code: "unknown_error",
			message: `Unknown error: ${err}`,
			statusCode: 500,
		});
	}
};
