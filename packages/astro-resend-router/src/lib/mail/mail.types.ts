import type { LocalSegment, LocalTopic } from "#/lib/config/types.ts";
import type {
	AllowedAction,
	BroadcastErrorCode,
	BroadcastSuccess,
	JoinErrorCode,
	JoinSuccess,
} from "#/lib/resend/index.ts";
import type { Status } from "#/lib/shared/types.ts";

// PARSE
export type ParseErrorCode = "missing_recipient" | "missing_segment";
export type ParseError = Status<ParseErrorCode>;
export type ParseSuccess = {
	action: AllowedAction;
	sender: string;
	emailId: string;
	segmentIdentifier: string;
	topicIdentifier?: string;
};

// VALIDATE-TARGETS
export type ValidationErrorCode =
	| "segment_local_error"
	| "segment_remote_error"
	| "topic_local_error"
	| "topic_remote_error";
export type ValidationError = Status<ValidationErrorCode>;
export type ValidationSuccess = {
	action: AllowedAction;
	segment: LocalSegment;
	topic?: LocalTopic;
};

// PERMISSIONS
export type PermissionsErrorCode =
	| "fetch_remote_contacts_error"
	| "unauthorized_sender";
export type PermissionsError = Status<PermissionsErrorCode>;

// ROUTER
export type RouterErrorCode = JoinErrorCode | BroadcastErrorCode;
export type RouterError = Status<RouterErrorCode>;
export type RouterSuccess = BroadcastSuccess | JoinSuccess;
