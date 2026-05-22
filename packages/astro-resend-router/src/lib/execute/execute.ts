import type {
	ExecutionError,
	ExecutionResult,
	ParsedContext,
	Result,
	ValidTargets,
} from "../contracts/types.ts";
import { handleBroadcast } from "./broadcast.ts";
import { handleJoin } from "./join.ts";

export const handleExecution = async (
	ctx: ParsedContext,
	targets: ValidTargets,
): Promise<Result<ExecutionResult, ExecutionError>> => {
	if (targets.action === "join") {
		const res = await handleJoin(targets, ctx.sender);
		if (!res.ok)
			return {
				ok: false,
				error: res.error,
			};
		return {
			ok: true,
			value: {
				code: "join_success",
				message: res.value.message,
				statusCode: 200,
			},
		};
	}

	const res = await handleBroadcast(targets, ctx);
	if (!res.ok)
		return {
			ok: false,
			error: res.error,
		};
	return {
		ok: true,
		value: {
			code: "broadcast_success",
			message: res.value.message,
			statusCode: 200,
		},
	};
};
