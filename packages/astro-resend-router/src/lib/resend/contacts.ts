import type {
	CreateContactResponseSuccess,
	GetContactResponseSuccess,
	ListContactsResponseSuccess,
} from "resend";

import { err, ok } from "#/lib/api/index.ts";
import type { Result } from "#/lib/shared/types.ts";

import { resend } from "./client.ts";
import type { CreateContactError, FetchContactsError } from "./resend.types.ts";

export const fetchResendContact = async (
	email: string,
): Promise<Result<GetContactResponseSuccess, FetchContactsError>> => {
	const { data, error } = await resend.contacts.get({
		email,
	});

	if (error || !data)
		return err({
			code: "fetch_remote_contacts_error",
			message: error.message,
			statusCode: error.statusCode ?? 500,
		});

	return ok(data);
};

export const fetchResendContactsList = async (
	segmentId: string,
): Promise<Result<ListContactsResponseSuccess, FetchContactsError>> => {
	const { data, error } = await resend.contacts.list({ segmentId });

	if (error || !data)
		return err({
			code: "fetch_remote_contacts_error",
			message: error.message,
			statusCode: error.statusCode ?? 500,
		});

	return ok(data);
};

type CreateResendContactOptions = {
	email: string;
	firstName?: string;
	lastName?: string;
	source?: string;
	segment: {
		id: string;
	};
	topic?: {
		id: string;
		subscription: "opt_in" | "opt_out";
	};
};

export const createResendContact = async (
	config: CreateResendContactOptions,
): Promise<Result<CreateContactResponseSuccess, CreateContactError>> => {
	const { email, segment, topic, firstName, lastName, source } = config;

	const { data, error } = await resend.contacts.create({
		email,
		firstName: firstName ?? "",
		lastName: lastName ?? "",
		segments: [{ id: segment.id }],
		properties: source
			? {
					source,
				}
			: {},
		topics: topic ? [{ id: topic?.id, subscription: topic?.subscription }] : [],
	});

	if (error)
		return err({
			code: "create_contact_error",
			message: error.message,
			statusCode: error.statusCode ?? 500,
		});

	return ok(data);
};
