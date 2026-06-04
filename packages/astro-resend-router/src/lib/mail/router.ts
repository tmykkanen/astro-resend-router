import { err, ok } from "#/lib/api/index.ts";
import { handleBroadcast, handleJoin } from "#/lib/resend/index.ts";
import type { Result } from "#/lib/shared/types.ts";

import type {
	ParseSuccess,
	RouterError,
	RouterSuccess,
	ValidationSuccess,
} from "./mail.types.ts";

export const routeAction = async (
	ctx: ParseSuccess,
	targets: ValidationSuccess,
): Promise<Result<RouterSuccess, RouterError>> => {
	if (targets.action === "join") {
		const res = await handleJoin(targets, ctx.sender);
		if (!res.ok) return err(res.error);

		return ok(res.value);
	}

	const res = await handleBroadcast(targets, ctx);
	if (!res.ok) return err(res.error);

	return ok(res.value);
};
