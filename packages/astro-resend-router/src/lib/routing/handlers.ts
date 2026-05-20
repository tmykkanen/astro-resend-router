import { errorResponse } from "../errors.ts";
import { resend } from "../resend.ts";
import type { ValidateTargetsSuccess } from "../types.ts";
import { buildBroadcastName } from "../util.ts";

export const handleJoin = async (
	validTargets: ValidateTargetsSuccess,
	requestFrom: string,
): Promise<Response> => {
	const { error: createContactError } = await resend.contacts.create({
		email: requestFrom,
		segments: [{ id: validTargets.segment.segmentId }],
		topics: validTargets.topic
			? [{ id: validTargets.topic.topicId, subscription: "opt_in" }]
			: [],
	});

	if (createContactError)
		return errorResponse(
			createContactError.message,
			createContactError.statusCode ?? 500,
		);

	const { data, error: confirmCreateContactError } = await resend.emails.send({
		from: `${validTargets.segment.sendFromEmail.name} <${validTargets.segment.sendFromEmail.email}>`,
		to: requestFrom,
		subject: "You have been subscribed!",
		html: `<p>Thank you for subscribing to segment [${
			validTargets.segment.name
		}]${
			validTargets.topic ? ` and topic [${validTargets.topic.name}]` : ""
		}</p>`,
	});

	if (confirmCreateContactError)
		return errorResponse(
			confirmCreateContactError.message,
			confirmCreateContactError.statusCode ?? 500,
		);

	return new Response(
		JSON.stringify({
			message: `Successfully created contact for ${requestFrom}. Contact id: ${data.id}`,
		}),
		{
			status: 200,
		},
	);
};

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
			html: email.html ?? "",
			text: email.text ?? "",
			replyTo: email.from,
			name,
			send: true,
		});

	if (createBroadcastError)
		return errorResponse(
			createBroadcastError.message ?? "Failed to create and send broadcast.",
			createBroadcastError.statusCode ?? 500,
		);

	return new Response(`Successfully sent broadcast: ${broadcast.id}`, {
		status: 200,
	});
};
