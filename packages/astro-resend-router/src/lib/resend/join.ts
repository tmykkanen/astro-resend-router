import { err, ok } from "#/lib/api/index.ts";
import type { Result, ValidatedContext } from "#/lib/shared/types.ts";

import { resend } from "./client.ts";
import { createResendContact } from "./contacts.ts";
import type { JoinError, JoinSuccess } from "./resend.types.ts";

export const handleJoin = async (
	ctx: ValidatedContext,
): Promise<Result<JoinSuccess, JoinError>> => {
	const { segment, topic } = ctx;

	const createContact = await createResendContact(
		ctx.requestFrom,
		[{ id: segment.segmentId }],
		topic ? [{ id: topic.topicId, subscription: "opt_in" }] : [],
	);

	if (!createContact.ok) return err(createContact.error);

	const { data, error: confirmCreateContactError } = await resend.emails.send({
		from: `${ctx.segment.sendFromEmail.name} <${ctx.segment.sendFromEmail.email}>`,
		to: ctx.requestFrom,
		subject: "You have been subscribed!",
		html: `<p>Thank you for subscribing to segment [${
			ctx.segment.segmentName
		}]${ctx.topic ? ` and topic [${ctx.topic.topicName}]` : ""}</p>`,
	});

	if (confirmCreateContactError)
		return err({
			code: "send_confirmation_error",
			message: confirmCreateContactError.message,
			statusCode: confirmCreateContactError.statusCode ?? 500,
		});

	return ok({
		code: "join_success",
		message: `Successfully created contact for ${ctx.requestFrom}. Contact id: ${data.id}`,
		statusCode: 200,
	});
};
