import type { EmailReceivedEvent } from "resend";

import type { Status } from "#/lib/shared/types.ts";

// ACTIONS
const ALLOWED_ACTIONS = ["join", "broadcast"] as const;
export type AllowedAction = (typeof ALLOWED_ACTIONS)[number];

const ALLOWED_ACTION_SET = new Set<AllowedAction>(ALLOWED_ACTIONS);

export const isAllowedAction = (value: string): value is AllowedAction => {
	return ALLOWED_ACTION_SET.has(value as AllowedAction);
};

// VERIFY WEBHOOK
export type VerifyErrorCode =
	| "missing_svix_headers"
	| "missing_webhook_secret"
	| "unhandled_webhook_event_type"
	| "unknown_webhook_verification_error";
export type VerifyError = Status<VerifyErrorCode>;
export type VerifySuccess = EmailReceivedEvent;

// JOIN
export type JoinErrorCode = "create_contact_error" | "send_confirmation_error";
export type JoinError = Status<JoinErrorCode>;
export type JoinSuccess = Status<"join_success">;

// BROADCAST
export type BroadcastErrorCode = "fetch_email_error" | "create_broadcast_error";
export type BroadcastError = Status<BroadcastErrorCode>;
export type BroadcastSuccess = Status<"broadcast_success">;

// CONTACTS
export type FetchContactsErrorCode = "fetch_remote_contacts_error";
export type FetchContactsError = Status<FetchContactsErrorCode>;
export type CreateContactErrorCode = "create_contact_error";
export type CreateContactError = Status<CreateContactErrorCode>;
