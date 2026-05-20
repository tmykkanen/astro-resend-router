import config from "virtual:astro-resend-router/config";
import type { GetReceivingEmailResponseSuccess } from "resend";
import type { LocalSegment } from "./types.ts";

export const getLocalSegment = (name: string) => {
	return config.segments.find((segment) => segment.name === name);
};

export const getLocalTopic = (name: string, localSegment: LocalSegment) => {
	return localSegment.topics?.find((topic) => topic.name === name);
};

export const buildBroadcastName = (email: GetReceivingEmailResponseSuccess) => {
	const suffix = `(${email.from})`;
	const ellipsis = "...";
	const max = 70;
	const words = email.subject.split(" ");

	let fit = fitWords(words, max - suffix.length);
	const truncated = fit !== email.subject.trim();

	const from = `${truncated ? ellipsis : ""}${suffix.trimStart()}`;
	if (truncated) {
		fit = fitWords(words, max - from.length);
	}

	return `${fit}${from}`.trim();
};

const fitWords = (words: string[], available: number) => {
	if (available <= 0) return "";

	let subject = "";
	for (const word of words) {
		const next = subject ? `${subject} ${word}` : word;
		if (next.length > available) break;
		subject = next;
	}

	if (!subject && words[0]) {
		subject = words[0].slice(0, available);
	}

	return subject;
};
