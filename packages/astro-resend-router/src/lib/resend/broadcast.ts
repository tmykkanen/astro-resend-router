import { err, ok } from "#/lib/api/index.ts";
import type { Result, ValidatedContext } from "#/lib/shared/types.ts";

import { resend } from "./client.ts";
import type { BroadcastError, BroadcastSuccess } from "./resend.types.ts";
import { buildBroadcastName } from "./utils/buildBroadcastName.ts";
import { buildEmail } from "./utils/buildEmail.ts";

export const handleBroadcast = async (
	ctx: ValidatedContext,
): Promise<Result<BroadcastSuccess, BroadcastError>> => {
	// Get incoming email's content
	const { data: email, error: emailError } = await resend.emails.receiving.get(
		ctx.emailId,
	);

	if (emailError || !email)
		return err({
			code: "fetch_email_error",
			message: emailError.message ?? "Failed to fetch email content.",
			statusCode: emailError.statusCode ?? 500,
		});

	// create & send broadcast
	const { data: broadcast, error: createBroadcastError } =
		await resend.broadcasts.create({
			segmentId: ctx.segment.segmentId,
			...(ctx.topic && { topicId: ctx.topic.topicId }),
			from: `${ctx.segment.sendFromEmail.name} <${ctx.segment.sendFromEmail.email}>`,
			subject: email.subject,
			html: buildEmail(email.html ?? "", ctx),
			replyTo: email.from,
			name: buildBroadcastName(email),
			send: true,
		});

	if (createBroadcastError)
		return err({
			code: "create_broadcast_error",
			message:
				createBroadcastError.message ?? "Failed to create and send broadcast.",
			statusCode: createBroadcastError.statusCode ?? 500,
		});

	return ok({
		code: "broadcast_success",
		message: `Successfully sent broadcast: ${broadcast.id}`,
		statusCode: 200,
	});
};
