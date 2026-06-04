import { err, ok, warn } from "#/lib/api/index.ts";
import { isAllowedAction } from "#/lib/resend/index.ts";
import type { VerifySuccess } from "#/lib/resend/resend.types.ts";
import type { Result } from "#/lib/shared/types.ts";

import type { ParseError, ParseSuccess } from "./mail.types.ts";

export const parseContext = (
	verifiedPayload: VerifySuccess,
): Result<ParseSuccess, ParseError> => {
	// Validate recipient presence
	const recipients = verifiedPayload.data.to;
	const sender = verifiedPayload.data.from.trim().toLowerCase();
	const emailId = verifiedPayload.data.email_id;

	const recipient = recipients[0];
	if (!recipient)
		return err({
			code: "missing_recipient",
			message: "Missing recipient email address",
			statusCode: 400,
		});

	if (recipients.length > 1) {
		warn(
			`Multiple recipients received; only processing first.\nRecipients: ${recipients}`,
		);
	}

	const parts = recipient
		.split("@")[0]
		?.trim()
		.toLowerCase()
		?.split(".")
		.filter(Boolean);

	if (!parts?.length)
		return err({
			code: "missing_recipient",
			message: "Missing recipient information",
			statusCode: 400,
		});

	// Ignores anything after the first three parts
	const [p0, p1, p2] = parts;

	if (!p0)
		return err({
			code: "missing_recipient",
			message: "Missing recipient information",
			statusCode: 400,
		});

	// True for [action, segment], [action, segment, topic]
	// False for [action]
	if (isAllowedAction(p0))
		return p1
			? ok({
					action: p0,
					sender,
					emailId,
					segmentIdentifier: p1,
					...(p2 && { topicIdentifier: p2 }),
				})
			: err({
					code: "missing_segment",
					message: "Unable to parse segment from recipient",
					statusCode: 400,
				});

	// True for [segment], [segment, topic]
	return ok({
		action: "broadcast",
		sender,
		emailId,
		segmentIdentifier: p0,
		...(p1 && { topicIdentifier: p1 }),
	});
};
