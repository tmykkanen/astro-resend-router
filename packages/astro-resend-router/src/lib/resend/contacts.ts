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

export const fetchResendContactsList = async (): Promise<
	Result<ListContactsResponseSuccess, FetchContactsError>
> => {
	const { data, error } = await resend.contacts.list();

	if (error || !data)
		return err({
			code: "fetch_remote_contacts_error",
			message: error.message,
			statusCode: error.statusCode ?? 500,
		});

	return ok(data);
};

export const createResendContact = async (
	email: string,
	segments: { id: string }[],
	topics?: {
		id: string;
		subscription: "opt_in" | "opt_out";
	}[],
): Promise<Result<CreateContactResponseSuccess, CreateContactError>> => {
	const { data, error } = await resend.contacts.create({
		email,
		segments,
		topics: topics ?? [],
	});

	if (error)
		return err({
			code: "create_contact_error",
			message: error.message,
			statusCode: error.statusCode ?? 500,
		});

	return ok(data);
};
