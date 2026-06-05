import { z } from "astro/zod";

export const LocalTopicSchema = z.object({
	/**
	 * Display-friendly name for this topic.
	 * Does not need to match the topic name in Resend.
	 * @example 'PFI Newsletter'
	 */
	topicName: z.string(),
	/**
	 * Identifier for this topic. Matched as a dot-separated suffix after the segment name. Case-insensitive.
	 * Does not need to match the topic name in Resend.
	 * @example 'newsletter' // matches pfi.newsletter@domain.com
	 */
	topicIdentifier: z
		.string()
		.trim()
		.transform((s) => s.toLowerCase()),
	/**
	 * Resend topic ID.
	 * Find it by navigating to Topics and clicking `...` next to the target topic.
	 */
	topicId: z.string(),
});

export const LocalSegmentSchema = z.object({
	/**
	 * Display-friendly name for this segment.
	 * Does not need to match the segment name in Resend.
	 * @example 'Prairie Forge'
	 */
	segmentName: z.string(),
	/**
	 * Identifier for this segment. Used to match the local part of the recipient address.
	 * Does not need to match the segment name in Resend.
	 * @example 'pfi' // matches pfi@domain.com
	 */
	segmentIdentifier: z
		.string()
		.trim()
		.transform((s) => s.toLowerCase()),
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
	authorizedSenders: z.array(z.email()).default([]),
	/**
	 * Allow anyone to self-subscribe by emailing a `join`-prefixed address.
	 * @example
	 * // join.pfi@domain.com — subscribes to the 'pfi' segment
	 * // join.pfi.newsletter@domain.com — subscribes to the 'newsletter' topic within 'pfi'
	 * @default false
	 */
	allowPublicJoin: z.boolean().default(false),
	/**
	 * Enables one-way sync from supported providers to Resend Segment before sending a broadcast.
	 * Configure sync providers in sync/sync.ts
	 * @default false
	 */
	syncContacts: z.boolean().default(false),
	/**
	 * Optional custom HTML footer to replace the default footer appended to every broadcast email.
	 * This should be a fully-formed HTML string.
	 *
	 * ⚠️ Important:
	 * - Must be valid HTML (email-safe markup recommended)
	 * - Should include a Resend unsubscribe placeholder if required: {{{RESEND_UNSUBSCRIBE_URL}}}
	 * - Will be appended as-is (no sanitization or wrapping is applied)
	 *
	 * @example
	 * ```ts
	 * customEmailFooter: `
	 *  <hr style="margin-top:24px;border:none;border-top:1px solid #444;" />
	 *  <p style="font-size:12px; color:#666; line-height:1.5; margin-top:16px;">
	 *  You’re receiving this because you subscribed to our newsletter.<br />
	 *  Want to stop receiving these emails?<br />
	 *    <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#666;">
	 *      Unsubscribe instantly.
	 *    </a>
	 *  </p>
	 * `
	 * ```
	 */
	customEmailFooter: z
		.string()
		.default("")
		.refine((html) => html === "" || html.toLowerCase().includes("<a"), {
			message: "Footer must include at least one link (<a>)",
		})
		.refine(
			(html) =>
				html === "" ||
				html.toLowerCase().includes("{{{resend_unsubscribe_url}}}"),
			{
				message:
					"Footer must include {{{RESEND_UNSUBSCRIBE_URL}}} for compliance.",
			},
		),
	/**
	 * Topics within this segment. Matched by an additional dot-separated suffix in the address.
	 * @example
	 * // Email sent to pfi.newsletter@domain.com routes to the 'newsletter' topic in 'pfi'
	 */
	topics: z
		.array(LocalTopicSchema)
		.superRefine((topics, ctx) => {
			const idents = new Set<string>();
			for (const topic of topics) {
				if (idents.has(topic.topicIdentifier)) {
					ctx.addIssue({
						code: "custom",
						message: `Duplicate topic identifier: ${topic.topicIdentifier}`,
					});
				}
				idents.add(topic.topicIdentifier);
			}
		})
		.default([]),
});

export const UserConfigSchema = z.object({
	/**
	 * Resend audience segments used to route incoming emails.
	 * Each segment is matched by the local part of the recipient address.
	 * @example
	 * segments: [{ name: 'pfi', segmentId: '...' }]
	 * // Email sent to pfi@domain.com routes to the 'pfi' segment
	 */
	segments: z.array(LocalSegmentSchema).superRefine((segments, ctx) => {
		const idents = new Set<string>();
		for (const seg of segments) {
			if (idents.has(seg.segmentIdentifier)) {
				ctx.addIssue({
					code: "custom",
					message: `Duplicate segment name: ${seg.segmentIdentifier}`,
				});
			}
			idents.add(seg.segmentIdentifier);
		}
	}),
});

export type LocalTopic = z.infer<typeof LocalTopicSchema>;
export type LocalSegment = z.infer<typeof LocalSegmentSchema>;
export type UserConfig = z.infer<typeof UserConfigSchema>;
