import type { GetReceivingEmailResponseSuccess } from "resend";

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
