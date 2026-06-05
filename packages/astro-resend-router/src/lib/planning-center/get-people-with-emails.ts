import { err, ok } from "../api/index.ts";
import { fetchEmails } from "./fetch-emails.ts";
import { fetchPeople } from "./fetch-people.ts";

export const getPeopleWithEmails = async () => {
	// * Fetch People from PCO
	const people = await fetchPeople();
	if (!people.ok) return err(people.error);

	// * Fetch Emails from PCO
	const emails = await fetchEmails();
	if (!emails.ok) return err(emails.error);

	// * Hydrate People with Emails
	const emailByPersonId = new Map(
		emails.value.map((email) => [
			email.relationships.person.data.id,
			email.attributes.address,
		]),
	);

	const peopleWithEmails = people.value.flatMap((person) => {
		const email = emailByPersonId.get(person.id);

		if (!email || person.attributes.status !== "active") {
			return [];
		}

		return [
			{
				firstName: person.attributes.first_name ?? "",
				lastName: person.attributes.last_name ?? "",
				email,
				source: "planning_center_online",
			},
		];
	});

	return ok(peopleWithEmails);
};
