import type { WebhookEventPayload } from "resend";

/**
 * Topic within a segment. Matched by an additional dot-separated suffix in the address.
 * @example
 * // Email sent to pfi.newsletter@domain.com routes to the 'newsletter' topic in 'pfi'
 */
type LocalTopic = {
	/**
	 * Display-friendly name for this topic.
	 * Does not need to match the topic name in Resend.
	 * @example 'PFI Newsletter'
	 */
	topicName: string;
	/**
	 * Identifier for this topic. Matched as a dot-separated suffix after the segment name.
	 * Does not need to match the topic name in Resend.
	 * @example 'newsletter' // matches pfi.newsletter@domain.com
	 */
	topicIdentifier: string;
	/**
	 * Resend topic ID.
	 * Find it by navigating to Topics and clicking `...` next to the target topic.
	 */
	topicId: string;
};

/**
 * Resend audience segment used to route incoming emails.
 * Each segment is matched by the local part of the recipient address.
 * @example
 * // Email sent to pfi@domain.com routes to the 'pfi' segment
 */
export type LocalSegment = {
	/**
	 * Display-friendly name for this segment.
	 * Does not need to match the segment name in Resend.
	 * @example 'Prairie Forge'
	 */
	segmentName: string;
	/**
	 * Identifier for this segment. Used to match the local part of the recipient address.
	 * Does not need to match the segment name in Resend.
	 * @example 'pfi' // matches pfi@domain.com
	 */
	segmentIdentifier: string;
	/**
	 * Resend audience segment ID.
	 * Find it by navigating to Segments and clicking `...` next to the target segment.
	 */
	segmentId: string;
	/** The sender identity used for outgoing broadcasts from this segment/topics. */
	sendFromEmail: {
		/** Display name shown in the recipient's email client. */
		name: string;
		/** Verified Resend sender address. */
		email: string;
	};
	/**
	 * List of email addresses permitted to trigger broadcasts from this segment/topics.
	 */
	authorizedSenders?: string[];
	/**
	 * Allow anyone to self-subscribe by emailing a `join`-prefixed address.
	 * @example
	 * // join.pfi@domain.com — subscribes to the 'pfi' segment
	 * // join.pfi.newsletter@domain.com — subscribes to the 'newsletter' topic within 'pfi'
	 * @default false
	 */
	allowPublicJoin?: boolean;
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
	customEmailFooter?: string;
	/**
	 * Array of topics within this segment. Matched by an additional dot-separated suffix in the address.
	 * @example
	 * // Email sent to pfi.newsletter@domain.com routes to the 'newsletter' topic in 'pfi'
	 */
	topics?: LocalTopic[];
};

export type UserConfig = {
	/**
	 * Resend audience segments used to route incoming emails.
	 * Each segment is matched by the local part of the recipient address.
	 * @example
	 * segments: [{ name: 'pfi', segmentId: '...' }]
	 * // Email sent to pfi@domain.com routes to the 'pfi' segment
	 */
	segments: LocalSegment[];
};

type HandleError = {
	ok: false;
	res: Response;
};

type VerifyWebhookError = HandleError;
type VerifyWebhookSuccess = { ok: true; payload: WebhookEventPayload };
export type VerifyWebhookResult = VerifyWebhookSuccess | VerifyWebhookError;

type ParseRecipientError = HandleError;
export type ParseRecipientSuccess = {
	ok: true;
	action?: "join";
	segmentIdentifier: string;
	topicIdentifier?: string;
};
export type ParseRecipientResult = ParseRecipientError | ParseRecipientSuccess;

type ValidateTargetsError = HandleError;
export type ValidateTargetsSuccess = {
	ok: true;
	action?: "join";
	segment: LocalSegment;
	topic?: LocalTopic;
};
export type ValidateTargetsResults =
	| ValidateTargetsError
	| ValidateTargetsSuccess;

type VerifyPermissionsError = HandleError;
type VerifyPermissionsSuccess = { ok: true };
export type VerifyPermissionsResult =
	| VerifyPermissionsError
	| VerifyPermissionsSuccess;
