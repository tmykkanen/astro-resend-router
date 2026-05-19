// import type { z } from "astro/zod";
import type {
  GetSegmentResponseSuccess,
  GetTopicResponseSuccess,
  WebhookEventPayload,
} from "resend";
// import type { UserConfigSchema } from "./schemas.ts";

// export type UserConfig = z.infer<typeof UserConfigSchema>;

export type UserConfig = {
  /**
   * Resend audience segments used to route incoming emails.
   * Each segment is matched by the local part of the recipient address.
   * @example
   * segments: [{ name: 'pfi', segmentId: '...' }]
   * // Email sent to pfi@domain.com routes to the 'pfi' segment
   */
  segments: {
    /**
     * Identifier for this segment. Used to match the local part of the recipient address.
     * Does not need to match the segment name in Resend.
     * @example 'pfi' // matches pfi@domain.com
     */
    name: string;
    /**
     * Resend audience segment ID.
     * Find it by navigating to Segments and clicking `...` next to the target segment.
     */
    segmentId: string;
    /**
     * Topics within this segment. Matched by an additional dot-separated suffix in the address.
     * @example
     * // Email sent to pfi.newsletter@domain.com routes to the 'newsletter' topic in 'pfi'
     */
    topics?: {
      /**
       * Identifier for this topic. Matched as a dot-separated suffix after the segment name.
       * Does not need to match the topic name in Resend.
       * @example 'newsletter' // matches pfi.newsletter@domain.com
       */
      name: string;
      /**
       * Resend topic ID.
       * Find it by navigating to Topics and clicking `...` next to the target topic.
       */
      topicId: string;
    }[];
  }[];
  /** The sender identity used for outgoing broadcasts. */
  sendFromEmail: {
    /** Display name shown in the recipient's email client. */
    name: string;
    /** Verified Resend sender address. */
    email: string;
  };
  /**
   * List of email addresses permitted to trigger broadcasts.
   * API will also check if contact on Resend has authorized_senders = 'true'
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
  segment?: string;
  topic?: string;
};
export type ParseRecipientResult = ParseRecipientError | ParseRecipientSuccess;

type ValidateTargetsError = HandleError;
export type ValidateTargetsSuccess = {
  ok: true;
  action?: "join";
  segment?: GetSegmentResponseSuccess;
  topic?: GetTopicResponseSuccess;
};
export type ValidateTargetsResults =
  | ValidateTargetsError
  | ValidateTargetsSuccess;

type VerifyPermissionsError = HandleError;
type VerifyPermissionsSuccess = { ok: true };
export type VerifyPermissionsResult =
  | VerifyPermissionsError
  | VerifyPermissionsSuccess;
