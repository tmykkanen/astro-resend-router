import { z } from "astro/zod";

export const EmailSchema = z.object({
	id: z.string(),
	type: z.literal("Email"),
	attributes: z.object({
		address: z.email(),
	}),
	relationships: z.object({
		person: z.object({
			data: z.object({
				type: z.literal("Person"),
				id: z.string(),
			}),
		}),
	}),
});

export const FetchEmailsResponseSchema = z.object({
	data: z.array(EmailSchema),
});

export const PersonSchema = z.object({
	id: z.string(),
	attributes: z.object({
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		updated_at: z.string().optional(),
		status: z.string().optional(),
	}),
});

export const FetchPeopleResponseSchema = z.object({
	data: z.array(PersonSchema),
});
