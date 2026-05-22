import type {
	JoinError,
	JoinResult,
	Result,
	ValidTargets,
} from "../contracts/types.ts";
import { resend } from "../resend.ts";

export const handleJoin = async (
	validTargets: ValidTargets,
	requestFrom: string,
): Promise<Result<JoinResult, JoinError>> => {
	const { error: createContactError } = await resend.contacts.create({
		email: requestFrom,
		segments: [{ id: validTargets.segment.segmentId }],
		topics: validTargets.topic
			? [{ id: validTargets.topic.topicId, subscription: "opt_in" }]
			: [],
	});

	if (createContactError)
		return {
			ok: false,
			error: {
				code: "create_contact_error",
				message: createContactError.message,
				statusCode: createContactError.statusCode ?? 500,
			},
		};

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
		return {
			ok: false,
			error: {
				code: "send_confirmation_error",
				message: confirmCreateContactError.message,
				statusCode: confirmCreateContactError.statusCode ?? 500,
			},
		};

	return {
		ok: true,
		value: {
			message: `Successfully created contact for ${requestFrom}. Contact id: ${data.id}`,
		},
	};
};
