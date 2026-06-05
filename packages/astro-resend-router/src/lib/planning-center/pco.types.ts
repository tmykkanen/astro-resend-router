import type { z } from "astro/zod";

import type { Status } from "../shared/types.ts";
import type { EmailSchema, PersonSchema } from "./pco.schemas.ts";

export type EmailResult = z.infer<typeof EmailSchema>;
export type PersonResult = z.infer<typeof PersonSchema>;

type PCOApiErrorCodes = "pco_api_error" | "pco_api_empty_response";
export type FetchEmailsError = Status<PCOApiErrorCodes | "invalid_email_data">;
export type FetchPeopleError = Status<PCOApiErrorCodes | "invalid_people_data">;
