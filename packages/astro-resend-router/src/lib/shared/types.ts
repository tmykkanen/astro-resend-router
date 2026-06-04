import type { ValidationSuccess } from "#/lib/mail/index.ts";

type OkResult<Success> = Success extends void
	? { ok: true }
	: { ok: true; value: Success };
type ErrResult<Error> = Error extends void
	? { ok: false }
	: { ok: false; error: Error };

export type Result<Success, Error> = OkResult<Success> | ErrResult<Error>;

export type Status<C extends string> = {
	code: C;
	message: string;
	statusCode: number;
	details?: Record<string, unknown>;
};

export type UnknownErrorCode = "unknown_error";
export type UnknownError = Status<UnknownErrorCode>;

export type ValidatedContext = ValidationSuccess;
