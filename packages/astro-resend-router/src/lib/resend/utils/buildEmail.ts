import type { ValidatedContext } from "#/lib/shared/types.ts";

export const buildEmail = (content: string, ctx: ValidatedContext) => {
	const footer = ctx.segment.customEmailFooter || defaultEmailFooter(ctx);
	return `${content} ${footer}`;
};

const defaultEmailFooter = (ctx: ValidatedContext) => {
	return `
  <hr style="margin-top:24px;border:none;border-top:1px solid #444;" />

  <p style="font-size:12px; color:#666; line-height:1.5; margin-top:16px;">
        You’re receiving this because you subscribed to ${
					ctx.segment.segmentName
				}${ctx.topic ? ` and ${ctx.topic.topicName}` : ""}.<br />
        Want to stop receiving these emails?<br />

        <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#666;">
          Unsubscribe instantly.
        </a>
  </p>
  `;
};
