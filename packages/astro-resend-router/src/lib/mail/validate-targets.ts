import config from "virtual:astro-resend-router/config";

import { err, ok } from "#/lib/api/index.ts";
import {
	validateRemoteSegment,
	validateRemoteTopic,
} from "#/lib/resend/index.ts";
import type { Result } from "#/lib/shared/types.ts";

import type {
	ParseSuccess,
	ValidationError,
	ValidationSuccess,
} from "./mail.types.ts";

export const validateTargets = async (
	ctx: ParseSuccess,
): Promise<Result<ValidationSuccess, ValidationError>> => {
	const localSegment = config.segments.find(
		(segment) => segment.segmentIdentifier === ctx.segmentIdentifier,
	);

	if (!localSegment)
		return err({
			code: "segment_local_error",
			message: `Segment [${ctx.segmentIdentifier}] is not configured. Add to user configuration to proceed.`,
			statusCode: 400,
		});

	const { data: remoteSegment, error: remoteSegmentError } =
		await validateRemoteSegment(localSegment.segmentId);

	if (remoteSegmentError || !remoteSegment)
		return err({
			code: "segment_remote_error",
			message: `Error fetching segment [${localSegment.segmentName}] from resend: ${remoteSegmentError.message}`,
			statusCode: 500,
		});

	// Validate topic against local user config
	const localTopic = ctx.topicIdentifier
		? localSegment.topics?.find(
				(topic) => topic.topicIdentifier === ctx.topicIdentifier,
			)
		: undefined;

	if (ctx.topicIdentifier && !localTopic)
		return err({
			code: "topic_local_error",
			message: `Topic [${ctx.topicIdentifier}] is not configured for segment [${localSegment.segmentName}]`,
			statusCode: 400,
		});

	if (!localTopic)
		return ok({
			action: ctx.action,
			segment: localSegment,
			requestFrom: ctx.requestFrom,
			emailId: ctx.emailId,
		});

	// Verify remote topic id matches resendId
	const { data: remoteTopic, error: remoteTopicError } =
		await validateRemoteTopic(localTopic.topicId);

	if (remoteTopicError || !remoteTopic)
		return err({
			code: "topic_remote_error",
			message: `Error fetching topic [${localTopic.topicName}] from resend: ${remoteTopicError.message}`,
			statusCode: 500,
		});

	return ok({
		action: ctx.action,
		segment: localSegment,
		topic: localTopic,
		requestFrom: ctx.requestFrom,
		emailId: ctx.emailId,
	});
};
