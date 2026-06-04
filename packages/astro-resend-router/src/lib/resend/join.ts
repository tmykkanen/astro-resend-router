import { err, ok } from "#/lib/api/index.ts";
import type { ValidationSuccess } from "#/lib/mail/mail.types.ts";
import type { Result } from "#/lib/shared/types.ts";

import { resend } from "./client.ts";
import { createResendContact } from "./contacts.ts";
import type { JoinError, JoinSuccess } from "./resend.types.ts";

export const handleJoin = async (
	validTargets: ValidationSuccess,
	requestFrom: string,
): Promise<Result<JoinSuccess, JoinError>> => {
	const { segment, topic } = validTargets;

	const createContact = await createResendContact(
		requestFrom,
		[{ id: segment.segmentId }],
		topic ? [{ id: topic.topicId, subscription: "opt_in" }] : [],
	);

	if (!createContact.ok) return err(createContact.error);

	const { data, error: confirmCreateContactError } = await resend.emails.send({
		from: `${validTargets.segment.sendFromEmail.name} <${validTargets.segment.sendFromEmail.email}>`,
		to: requestFrom,
		subject: "You have been subscribed!",
		html: `<p>Thank you for subscribing to segment [${
			validTargets.segment.segmentName
		}]${
			validTargets.topic ? ` and topic [${validTargets.topic.topicName}]` : ""
		}</p>`,
	});

	if (confirmCreateContactError)
		return err({
			code: "send_confirmation_error",
			message: confirmCreateContactError.message,
			statusCode: confirmCreateContactError.statusCode ?? 500,
		});

	return ok({
		code: "join_success",
		message: `Successfully created contact for ${requestFrom}. Contact id: ${data.id}`,
		statusCode: 200,
	});
};
