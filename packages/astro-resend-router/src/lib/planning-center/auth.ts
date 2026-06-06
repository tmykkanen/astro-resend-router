import { PCO_CLIENT_ID, PCO_SECRET } from "astro:env/server";

import { throwError } from "#/lib/api/index.ts";

export const useAuth = () => {
	if (!PCO_CLIENT_ID || !PCO_SECRET) {
		throwError(
			"planningCenterSync Error",
			`planningCenterSync is enabled, but .env is missing:
            ${
							PCO_CLIENT_ID
								? "PCO_SECRET"
								: PCO_SECRET
									? "PCO_CLIENT_ID"
									: "PCO_CLIENT_ID and PCO_SECRET"
						}`,
		);
	}

	return {
		Authorization: `Basic ${Buffer.from(
			`${PCO_CLIENT_ID}:${PCO_SECRET}`,
		).toString("base64")}`,
		"User-Agent": "My App (me@example.com)",
	};
};
