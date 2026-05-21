import type { ValidateTargetsSuccess } from "../types.ts";

export const buildEmail = (
	content: string,
	validatedTargets: ValidateTargetsSuccess,
) => {
	const footer =
		validatedTargets.segment.customEmailFooter ||
		defaultEmailFooter(validatedTargets);
	return `${content} ${footer}`;
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
