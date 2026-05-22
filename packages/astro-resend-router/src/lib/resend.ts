/**
 * Resend Client Configuration
 *
 * This module initializes and exports the Resend client instance.
 * The client is used throughout the application to send emails.
 *
 * @see https://resend.com/docs/send-with-nodejs
 */

import { RESEND_API_KEY } from "astro:env/server";
import { Resend } from "resend";
import { throwError } from "./utils/astro-http-utils.ts";

// Validate that the API key is configured
if (!RESEND_API_KEY) {
	throwError(
		"Missing RESEND_API_KEY environment variable",
		"Get your API key from https://resend.com/api-keys",
	);
}

/**
 * Singleton Resend client instance
 *
 * Usage:
 * ```ts
 * import { resend } from '../lib/resend';
 *
 * const { data, error } = await resend.emails.send({
 *   from: 'delivered@resend.dev',
 *   to: 'delivered@resend.dev',
 *   subject: 'Hello',
 *   html: '<p>Hello World</p>'
 * });
 * ```
 */
export const resend = new Resend(RESEND_API_KEY);
