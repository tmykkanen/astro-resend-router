import type {
	BroadcastError,
	BroadcastResult,
	ParsedContext,
	Result,
	ValidTargets,
} from "../contracts/types.ts";
import { resend } from "../resend.ts";
import { buildBroadcastName } from "../utils/buildBroadcastName.ts";
import { buildEmail } from "../utils/buildEmail.ts";
import { verifyPermissions } from "./permissions.ts";

export const handleBroadcast = async (
	validTargets: ValidTargets,
	ctx: ParsedContext,
): Promise<Result<BroadcastResult, BroadcastError>> => {
	const permissions = await verifyPermissions(validTargets, ctx.sender);

	if (!permissions.ok)
		return {
			ok: false,
			error: permissions.error,
		};

	// Get incoming email's content
	const { data: email, error: emailError } = await resend.emails.receiving.get(
		ctx.emailId,
	);

	if (emailError || !email)
		return {
			ok: false,
			error: {
				code: "fetch_email_error",
				message: emailError.message ?? "Failed to fetch email content.",
				statusCode: emailError.statusCode ?? 500,
			},
		};

	// create & send broadcast
	const { data: broadcast, error: createBroadcastError } =
		await resend.broadcasts.create({
			segmentId: validTargets.segment.segmentId,
			...(validTargets.topic && { topicId: validTargets.topic.topicId }),
			from: `${validTargets.segment.sendFromEmail.name} <${validTargets.segment.sendFromEmail.email}>`,
			subject: email.subject,
			html: buildEmail(email.html ?? "", validTargets),
			replyTo: email.from,
			name: buildBroadcastName(email),
			send: true,
		});

	if (createBroadcastError)
		return {
			ok: false,
			error: {
				code: "create_broadcast_error",
				message:
					createBroadcastError.message ??
					"Failed to create and send broadcast.",
				statusCode: createBroadcastError.statusCode ?? 500,
			},
		};

	return {
		ok: true,
		value: {
			message: `Successfully sent broadcast: ${broadcast.id}`,
		},
	};
};
