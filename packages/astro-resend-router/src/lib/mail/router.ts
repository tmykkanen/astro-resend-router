import { err, ok } from "#/lib/api/index.ts";
import { handleBroadcast, handleJoin } from "#/lib/resend/index.ts";
import type { Result, ValidatedContext } from "#/lib/shared/types.ts";
import { syncContacts } from "#/lib/sync/index.ts";

import type { RouterError, RouterSuccess } from "./mail.types.ts";
import { verifyPermissions } from "./permissions.ts";

export const routeAction = async (
	ctx: ValidatedContext,
): Promise<Result<RouterSuccess, RouterError>> => {
	if (ctx.action === "join") {
		const res = await handleJoin(ctx);
		if (!res.ok) return err(res.error);

		return ok(res.value);
	}

	if (ctx.action === "broadcast") {
		// * Verify broadcast permissions
		const permissions = await verifyPermissions(ctx);
		if (!permissions.ok) return err(permissions.error);

		// * Conditionally sync contacts
		if (ctx.segment.syncContacts) {
			const sync = await syncContacts();
			// TODO: Return errors from within syncContacts?
			if (!sync.ok)
				return err({
					code: "sync_contacts_error",
					message: `syncContacts returned error: ${sync.error.code}`,
					statusCode: sync.error.statusCode,
				});
		}

		const res = await handleBroadcast(ctx);
		if (!res.ok) return err(res.error);
		return ok(res.value);
	}

	return err({
		code: "missing_action",
		message: "Missing or invalid action",
		statusCode: 400,
	});
};
