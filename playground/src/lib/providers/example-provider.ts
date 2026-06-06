import { err, ok, type ContactsProvider } from "astro-resend-router";

export const provider = {
  name: "example",
  getContacts: async () => {
    const res = await getPeopleWithEmails();

    if (!res.ok) {
      return err({
        code: "example_get_error",
        message: res.error.message,
        statusCode: res.error.statusCode,
      });
    }

    return ok(res.value);
  },
} as const satisfies ContactsProvider;

const getPeopleWithEmails = async () => {
  const fail = false;

  if (fail)
    return err({
      code: "failure",
      message: "example failure",
      statusCode: 400,
    });

  return ok([
    {
      email: "user@example.com",
      firstName: "Example",
      lastName: "User",
      source: "example-provider",
    },
  ]);
};
