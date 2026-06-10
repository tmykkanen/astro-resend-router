---
"astro-resend-router": minor
---

Added support for better mailchimp forwarding

- use cheerio to strip mailchimp header and footer, since we'll use
  Resend unsubscribe links
