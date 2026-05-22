import config from "virtual:astro-resend-router/config";
import type { LocalSegment } from "../contracts/config.types.ts";

export const getLocalSegment = (identifier: string) => {
	return config.segments.find(
		(segment) => segment.segmentIdentifier === identifier,
	);
};

export const getLocalTopic = (
	identifier: string,
	localSegment: LocalSegment,
) => {
	return localSegment.topics?.find(
		(topic) => topic.topicIdentifier === identifier,
	);
};
