import { errorResponse } from "../errors.ts";
import { resend } from "../resend.ts";
import type {
	ParseRecipientSuccess,
	ValidateTargetsResults,
} from "../types.ts";
import { getLocalSegment, getLocalTopic } from "../util.ts";

export const validateTargets = async (
	parsed: ParseRecipientSuccess,
): Promise<ValidateTargetsResults> => {
	const action = parsed.action ? { action: parsed.action } : {};

	// Validate segment against local user config
	const localSegment = getLocalSegment(parsed.segment);

	if (!localSegment)
		return {
			ok: false,
			res: errorResponse(
				`Segment [${parsed.segment}] is not configured. Add to user configuration to proceed.`,
				400,
			),
		};

	// Verify local segment id matches resendId
	const { data: remoteSegment, error: resendSegmentError } =
		await resend.segments.get(localSegment.segmentId);

	if (resendSegmentError || !remoteSegment)
		return {
			ok: false,
			res: errorResponse(
				`Error fetching segment [${localSegment.name}] from resend: ${resendSegmentError.message}`,
				500,
			),
		};

	// Validate topic against local user config
	const localTopic = parsed.topic
		? getLocalTopic(parsed.topic, localSegment)
		: undefined;

	if (parsed.topic && !localTopic) {
		return {
			ok: false,
			res: errorResponse(
				`Topic [${parsed.topic}] is not configured for segment [${parsed.segment}]`,
				400,
			),
		};
	}

	if (!localTopic) {
		return {
			ok: true,
			...action,
			segment: localSegment,
		};
	}

	// Verify remote topic id matches resendId
	const { data: remoteTopic, error: topicError } = await resend.topics.get(
		localTopic.topicId,
	);

	if (topicError || !remoteTopic)
		return {
			ok: false,
			res: errorResponse(
				`Error fetching topic [${localTopic.name}] from resend: ${topicError.message}`,
				500,
			),
		};

	return {
		ok: true,
		...action,
		segment: localSegment,
		topic: localTopic,
	};
};
