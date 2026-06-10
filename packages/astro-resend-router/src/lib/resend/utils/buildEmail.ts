import * as cheerio from "cheerio";

import type { ValidatedContext } from "#/lib/shared/types.ts";

export const buildEmail = (content: string, ctx: ValidatedContext) => {
	// Strip Mailchimp Header & Footer
	let body = content;
	if (body) {
		const $ = cheerio.load(body);
		$("#templatePreheader").remove();
		$("#canspamBarWrapper").remove();

		body = $.html();
	}

	const footer = ctx.segment.customEmailFooter || defaultEmailFooter(ctx);
	return `${body} ${footer}`;
};

const defaultEmailFooter = (ctx: ValidatedContext) => {
	return `
  <br>
  <br>
  <center>
  <p style="font-size:12px; color:#666; line-height:1.5; margin-top:16px;">
        You’re receiving this because you subscribed to ${
					ctx.segment.segmentName
				}${ctx.topic ? ` and ${ctx.topic.topicName}` : ""}.<br />
        Want to stop receiving these emails? <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#666;">Click here to unsubscribe.</a>
  </p>
  </center>
  `;
};
