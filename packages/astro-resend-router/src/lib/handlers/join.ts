import { errorResponse, successResponse } from "../astro-http-utils.ts";
import { resend } from "../resend.ts";
import type { ValidateTargetsSuccess } from "../types.ts";

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
			validTargets.segment.segmentName
		}]${
			validTargets.topic ? ` and topic [${validTargets.topic.topicName}]` : ""
		}</p>`,
	});

	if (confirmCreateContactError)
		return errorResponse(
			confirmCreateContactError.message,
			confirmCreateContactError.statusCode ?? 500,
		);

	return successResponse(
		`Successfully created contact for ${requestFrom}. Contact id: ${data.id}`,
		200,
	);
};
