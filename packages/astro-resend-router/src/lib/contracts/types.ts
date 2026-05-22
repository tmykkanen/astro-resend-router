import type { LocalSegment, LocalTopic } from "./config.types.ts";

export type Result<T, E> = T extends void
	? { ok: true } | { ok: false; error: E }
	: { ok: true; value: T } | { ok: false; error: E };

type BaseResult<C extends string> = {
	code: C;
	message: string;
	statusCode: number;
	details?: Record<string, unknown>;
};

// VERIFY
export type VerifyErrorCode =
	| "missing_svix_headers"
	| "missing_webhook_secret"
	| "unhandled_webhook_event_type"
	| "unknown_webhook_verification_error";
export type VerifyError = BaseResult<VerifyErrorCode>;

// PARSE
export type ParseErrorCode = "missing_recipient" | "missing_segment";
export type ParseError = BaseResult<ParseErrorCode>;

export const ALLOWED_ACTIONS = ["join", "broadcast"] as const;
export type AllowedAction = (typeof ALLOWED_ACTIONS)[number];
export const ALLOWED_ACTION_SET = new Set<AllowedAction>(ALLOWED_ACTIONS);
export const isAllowedAction = (value: string): value is AllowedAction => {
	return ALLOWED_ACTION_SET.has(value as AllowedAction);
};

export type ParsedContext = {
	action: AllowedAction;
	sender: string;
	emailId: string;
	segmentIdentifier: string;
	topicIdentifier?: string;
};

// VALIDATE
export type ValidationErrorCode =
	| "segment_local_error"
	| "segment_remote_error"
	| "topic_local_error"
	| "topic_remote_error";
export type ValidationError = BaseResult<ValidationErrorCode>;

export type ValidTargets = {
	action?: AllowedAction;
	segment: LocalSegment;
	topic?: LocalTopic;
};

// JOIN
export type JoinErrorCode = "create_contact_error" | "send_confirmation_error";
export type JoinError = BaseResult<JoinErrorCode>;

export type JoinResult = {
	message: string;
};

// PERMISSIONS
export type PermissionsErrorCode =
	| "fetch_remote_contacts_error"
	| "unauthorized_sender";
export type PermissionsError = BaseResult<PermissionsErrorCode>;

// BROADCAST
export type BroadcastErrorCode =
	| "fetch_email_error"
	| "create_broadcast_error"
	| PermissionsErrorCode;
export type BroadcastError = BaseResult<BroadcastErrorCode>;

export type BroadcastResult = {
	message: string;
};

// EXECUTION
export type ExecutionErrorCode = JoinErrorCode | BroadcastErrorCode;
export type ExecutionSuccessCode = "join_success" | "broadcast_success";
export type ExecutionError = BaseResult<ExecutionErrorCode>;
export type ExecutionResult = BaseResult<ExecutionSuccessCode>;

export type UnknownErrorCode = "unknown_error";
export type UnknownError = BaseResult<UnknownErrorCode>;
