import { z } from "astro/zod";

export const UserConfigSchema = z.object({
	/**
	 * Resend segments
	 */
	segments: z
		.array(
			z.object({
				/**
				 * Name of segment. This is what will trigger routing to a particular segment.
				 * Doesn't need to match the segment name in Resend itself.
				 * @example
				 * name: 'pfi'
				 * // Will route email sent to pfi@domain.com to the 'pfi' segment.
				 */
				name: z.string().transform((s) => s.toLowerCase()),
				/**
				 * Resend id for the Segment.
				 * Find this by navigating to Segments clicking the `...`.
				 */
				segmentId: z.string(),
				topics: z
					.array(
						z.object({
							/**
							 * Topic name
							 */
							name: z.string().transform((s) => s.toLowerCase()),
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
	/**
	 * Email address to send broadcasts from
	 */
	sendFromEmail: z.object({
		name: z.string(),
		email: z.email(),
	}),
	/**
	 * Email addresses of users authorized to send broadcasts
	 */
	authorizedSenders: z.array(z.string()).optional(),
	/**
	 * Set to true to enable joining a segment or topic by prefixing 'join'.
	 * Group must be defined in subscriptionGroups above.
	 * @example
	 * join.pfi@domain.com
	 * // Will route user to join the group 'pfi'.
	 */
	allowPublicJoin: z.boolean().default(false),
});
