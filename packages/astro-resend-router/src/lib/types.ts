import type { z } from "astro/zod";
import type {
	GetSegmentResponseSuccess,
	GetTopicResponseSuccess,
	WebhookEventPayload,
} from "resend";
import type { UserConfigSchema } from "./schemas.ts";

export type UserConfig = z.infer<typeof UserConfigSchema>;

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
