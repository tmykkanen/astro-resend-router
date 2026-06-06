import createClient from "openapi-fetch";

import type { paths } from "./pco.openapi.types.js";

export const pco = createClient<paths>({
	baseUrl: "https://api.planningcenteronline.com/people/v2",
});
