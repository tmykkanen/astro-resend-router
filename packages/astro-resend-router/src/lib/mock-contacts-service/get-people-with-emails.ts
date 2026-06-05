import { err, ok } from "#/lib/api/index.ts";

export const getPeopleWithEmails = async () => {
	const fail = false;

	if (fail)
		return err({
			code: "failure",
			message: "mock failure",
			statusCode: 400,
		});

	return ok([
		{
			email: "jsmith@example.com",
			firstName: "John",
			lastName: "Smith",
			source: "mock-contacts",
		},
	]);
};
