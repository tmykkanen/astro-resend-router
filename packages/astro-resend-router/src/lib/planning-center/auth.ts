import { PCO_CLIENT_ID, PCO_SECRET } from "astro:env/server";

export const authHeaders = {
	Authorization: `Basic ${Buffer.from(
		`${PCO_CLIENT_ID}:${PCO_SECRET}`,
	).toString("base64")}`,
	"User-Agent": "My App (me@example.com)",
};
