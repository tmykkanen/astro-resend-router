import type {
	ParsedContext,
	Result,
	ValidationError,
	ValidTargets,
} from "./contracts/types.ts";
import { resend } from "./resend.ts";
import { getLocalSegment, getLocalTopic } from "./utils/util.ts";

export const validateTargets = async (
	ctx: ParsedContext,
): Promise<Result<ValidTargets, ValidationError>> => {
	const action = ctx.action ? { action: ctx.action } : {};

	// Validate segment against local user config
	const localSegment = getLocalSegment(ctx.segmentIdentifier);

	if (!localSegment)
		return {
			ok: false,
			error: {
				code: "segment_local_error",
				message: `Segment [${ctx.segmentIdentifier}] is not configured. Add to user configuration to proceed.`,
				statusCode: 400,
			},
		};

	// Verify local segment id matches resendId
	const { data: remoteSegment, error: remoteSegmentError } =
		await resend.segments.get(localSegment.segmentId);

	if (remoteSegmentError || !remoteSegment)
		return {
			ok: false,
			error: {
				code: "segment_remote_error",
				message: `Error fetching segment [${localSegment.segmentName}] from resend: ${remoteSegmentError.message}`,
				statusCode: 500,
			},
		};

	// Validate topic against local user config
	const localTopic = ctx.topicIdentifier
		? getLocalTopic(ctx.topicIdentifier, localSegment)
		: undefined;

	if (ctx.topicIdentifier && !localTopic) {
		return {
			ok: false,
			error: {
				code: "topic_local_error",
				message: `Topic [${ctx.topicIdentifier}] is not configured for segment [${localSegment.segmentName}]`,
				statusCode: 400,
			},
		};
	}

	if (!localTopic) {
		return {
			ok: true,
			value: {
				...action,
				segment: localSegment,
			},
		};
	}

	// Verify remote topic id matches resendId
	const { data: remoteTopic, error: remoteTopicError } =
		await resend.topics.get(localTopic.topicId);

	if (remoteTopicError || !remoteTopic)
		return {
			ok: false,
			error: {
				code: "topic_remote_error",
				message: `Error fetching topic [${localTopic.topicName}] from resend: ${remoteTopicError.message}`,
				statusCode: 500,
			},
		};

	return {
		ok: true,
		value: {
			...action,
			segment: localSegment,
			topic: localTopic,
		},
	};
};
