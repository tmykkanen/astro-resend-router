import config from "virtual:astro-resend-router/config";
import { errorResponse } from "../errors.ts";
import { resend } from "../resend.ts";
import type { ValidateTargetsSuccess } from "../types.ts";
import { buildBroadcastName } from "../util.ts";

export const handleJoin = async (
	validTargets: ValidateTargetsSuccess,
	requestFrom: string,
): Promise<Response> => {
	const { segment, topic } = validTargets;

	const { error: createContactError } = await resend.contacts.create({
		email: requestFrom,
		segments: segment?.id ? [{ id: segment?.id }] : [],
		topics: topic?.id ? [{ id: topic?.id, subscription: "opt_in" }] : [],
	});
	if (createContactError)
		return errorResponse(
			createContactError.message,
			createContactError.statusCode ?? 500,
		);

	const { data, error: confirmCreateContactError } = await resend.emails.send({
		from: `${config.sendFromEmail.name} <${config.sendFromEmail.email}>`,
		to: requestFrom,
		subject: "You have been subscribed!",
		html: `<p>Thank you for subscribing to segment ${segment?.name} ${topic ? ` and topic ${topic.name}` : ""}</p>`,
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
			segmentId: validTargets.segment?.id ?? "",
			...(validTargets.topic?.id && { topicId: validTargets.topic.id }),
			from: `${config.sendFromEmail.name} <${config.sendFromEmail.email}>`,
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
