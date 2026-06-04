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
type ParseErrorCode = "missing_recipient" | "missing_segment";
export type ParseError = Status<ParseErrorCode>;
export type ParseSuccess = {
	action: AllowedAction;
	requestFrom: string;
	emailId: string;
	segmentIdentifier: string;
	topicIdentifier?: string;
};

// VALIDATE-TARGETS
type ValidationErrorCode =
	| "segment_local_error"
	| "segment_remote_error"
	| "topic_local_error"
	| "topic_remote_error";
export type ValidationError = Status<ValidationErrorCode>;
export type ValidationSuccess = {
	action: AllowedAction;
	requestFrom: string;
	emailId: string;
	segment: LocalSegment;
	topic?: LocalTopic;
};

// PERMISSIONS
type PermissionsErrorCode =
	| "fetch_remote_contacts_error"
	| "unauthorized_sender";
export type PermissionsError = Status<PermissionsErrorCode>;

// ROUTER
type RouterErrorCode =
	| JoinErrorCode
	| BroadcastErrorCode
	| PermissionsErrorCode
	| "get_people_with_emails_error"
	| "sync_contacts_error"
	| "missing_action";

export type RouterError = Status<RouterErrorCode>;
export type RouterSuccess = BroadcastSuccess | JoinSuccess;
