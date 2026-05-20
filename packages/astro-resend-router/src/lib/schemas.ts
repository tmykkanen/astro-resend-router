import { z } from "astro/zod";

export const UserConfigSchema = z.object({
	/**
	 * Resend audience segments used to route incoming emails.
	 * Each segment is matched by the local part of the recipient address.
	 * @example
	 * segments: [{ name: 'pfi', segmentId: '...' }]
	 * // Email sent to pfi@domain.com routes to the 'pfi' segment
	 */
	segments: z
		.array(
			z.object({
				/**
				 * Identifier for this segment. Used to match the local part of the recipient address.
				 * Does not need to match the segment name in Resend.
				 * @example 'pfi' // matches pfi@domain.com
				 */
				name: z.string().transform((s) => s.toLowerCase()),
				/**
				 * Resend audience segment ID.
				 * Find it by navigating to Segments and clicking `...` next to the target segment.
				 */
				segmentId: z.string(),
				/** The sender identity used for outgoing broadcasts from this segment/topics. */
				sendFromEmail: z.object({
					/** Display name shown in the recipient's email client. */
					name: z.string(),
					/** Verified Resend sender address. */
					email: z.email(),
				}),
				/**
				 * List of email addresses permitted to trigger broadcasts from this segment/topics.
				 */
				authorizedSenders: z.array(z.string()).default([]),
				/**
				 * Allow anyone to self-subscribe by emailing a `join`-prefixed address.
				 * @example
				 * // join.pfi@domain.com — subscribes to the 'pfi' segment
				 * // join.pfi.newsletter@domain.com — subscribes to the 'newsletter' topic within 'pfi'
				 * @default false
				 */
				allowPublicJoin: z.boolean().default(false),
				/**
				 * Topics within this segment. Matched by an additional dot-separated suffix in the address.
				 * @example
				 * // Email sent to pfi.newsletter@domain.com routes to the 'newsletter' topic in 'pfi'
				 */
				topics: z
					.array(
						z.object({
							/**
							 * Identifier for this topic. Matched as a dot-separated suffix after the segment name.
							 * Does not need to match the topic name in Resend.
							 * @example 'newsletter' // matches pfi.newsletter@domain.com
							 */
							name: z.string().transform((s) => s.toLowerCase()),
							/**
							 * Resend topic ID.
							 * Find it by navigating to Topics and clicking `...` next to the target topic.
							 */
							topicId: z.string(),
						}),
					)
					.superRefine((topics, ctx) => {
						const names = new Set<string>();
						for (const topic of topics) {
							if (names.has(topic.name)) {
								ctx.addIssue({
									code: "custom",
									message: `Duplicate topic name: ${topic.name}`,
								});
							}
							names.add(topic.name);
						}
					})
					.default([]),
			}),
		)
		.superRefine((segments, ctx) => {
			const names = new Set<string>();
			for (const seg of segments) {
				if (names.has(seg.name)) {
					ctx.addIssue({
						code: "custom",
						message: `Duplicate segment name: ${seg.name}`,
					});
				}
				names.add(seg.name);
			}
		}),
});
