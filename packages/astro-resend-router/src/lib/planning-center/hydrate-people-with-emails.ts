import type { EmailResult, HydratedPerson, PersonResult } from "./pco.types.ts";

export const hydratePeopleWithEmails = (
	people: PersonResult[],
	emails: EmailResult[],
): HydratedPerson[] => {
	// Create lookup map
	const emailByPersonId = new Map(
		emails.map((email) => [
			email.relationships.person.data.id,
			email.attributes.address,
		]),
	);

	return people.flatMap((person) => {
		const email = emailByPersonId.get(person.id);

		if (!email || person.attributes.status !== "active") {
			return [];
		}

		return [
			{
				id: person.id,
				firstName: person.attributes.first_name ?? "",
				lastName: person.attributes.last_name ?? "",
				updated: person.attributes.updated_at ?? "",
				email,
			},
		];
	});
};
