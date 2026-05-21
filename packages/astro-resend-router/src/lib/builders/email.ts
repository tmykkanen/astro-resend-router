import { throwError } from "../astro-http-utils.ts";
import type { ValidateTargetsSuccess } from "../types.ts";

export const buildEmail = (
	content: string,
	validatedTargets: ValidateTargetsSuccess,
) => {
	const footer = validateEmailFooter(
		validatedTargets.segment.customEmailFooter ??
			defaultEmailFooter(validatedTargets),
	);

	return `${content} ${footer}`;
};

export const validateEmailFooter = (html: string) => {
	if (!html || typeof html !== "string") {
		return throwError("Invalid customEmailFooter", "Not a valid string");
	}

	const normalized = html.toLowerCase();

	if (!normalized.includes("<a")) {
		return throwError(
			"Invalid customEmailFooter",
			"Footer must include at least one link (<a>)",
		);
	}

	if (!normalized.includes("{{{resend_unsubscribe_url}}}")) {
		return throwError(
			"Invalid customEmailFooter",
			"Footer must include {{{RESEND_UNSUBSCRIBE_URL}}} for compliance.",
		);
	}

	return html;
};

const defaultEmailFooter = (validatedTargets: ValidateTargetsSuccess) => {
	return `
  <hr style="margin-top:24px;border:none;border-top:1px solid #444;" />

  <p style="font-size:12px; color:#666; line-height:1.5; margin-top:16px;">
        You’re receiving this because you subscribed to ${
					validatedTargets.segment.segmentName
				}${
					validatedTargets.topic
						? ` and ${validatedTargets.topic.topicName}`
						: ""
				}.<br />
        Want to stop receiving these emails?<br />

        <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#666;">
          Unsubscribe instantly.
        </a>
  </p>
  `;
};
