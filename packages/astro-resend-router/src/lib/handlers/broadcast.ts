import { errorResponse, successResponse } from "../astro-http-utils.ts";
import { buildBroadcastName } from "../builders/broadcastName.ts";
import { buildEmail } from "../builders/email.ts";
import { resend } from "../resend.ts";
import type { ValidateTargetsSuccess } from "../types.ts";

export const handleBroadcast = async (
	emailId: string,
	validTargets: ValidateTargetsSuccess,
): Promise<Response> => {
	// Get incoming email's content
	const { data: email, error: emailError } =
		await resend.emails.receiving.get(emailId);

	if (emailError || !email)
		return errorResponse(
			emailError.message ?? "Failed to fetch email content.",
			emailError.statusCode ?? 500,
		);

	// create & send broadcast
	const name = buildBroadcastName(email);

	const { data: broadcast, error: createBroadcastError } =
		await resend.broadcasts.create({
			segmentId: validTargets.segment.segmentId,
			...(validTargets.topic && { topicId: validTargets.topic.topicId }),
			from: `${validTargets.segment.sendFromEmail.name} <${validTargets.segment.sendFromEmail.email}>`,
			subject: email.subject,
			html: buildEmail(email.html ?? "", validTargets),
			replyTo: email.from,
			name,
			send: true,
		});

	if (createBroadcastError)
		return errorResponse(
			createBroadcastError.message ?? "Failed to create and send broadcast.",
			createBroadcastError.statusCode ?? 500,
		);

	return successResponse(`Successfully sent broadcast: ${broadcast.id}`, 200);
};
