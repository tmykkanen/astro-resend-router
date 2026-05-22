import type {
	ExecutionErrorCode,
	ExecutionSuccessCode,
	ParseErrorCode,
	UnknownErrorCode,
	ValidationErrorCode,
	VerifyErrorCode,
} from "./types.ts";

export type EndpointOutcome =
	| VerifyErrorCode
	| ParseErrorCode
	| ValidationErrorCode
	| ExecutionErrorCode
	| UnknownErrorCode
	| ExecutionSuccessCode
	| "unknown";

export type ServerStatus = {
	startedAt: string;
	startedAtMs: number;
};

export type WebhookStatus = {
	lastEvent: string | null;
	lastStatus: "success" | "error" | "unknown";
};

export type EndpointStatus = {
	ok: boolean;
	lastRequestAt: string | null;
	lastResponseAt: string | null;
	lastResponse: {
		statusCode: number | null;
		outcome: EndpointOutcome;
	};
};
