# `astro-resend-router`

An [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that turns [Resend](https://resend.com/) into a lightweight mailing list system by using a webhook and API endpoint.

## Usage

### Prerequisites

- [Resend](https://resend.com/) account with a [verified domain](https://resend.com/docs/dashboard/domains/introduction#verifying-a-domain)

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
# pnpm
pnpm astro add astro-resend-router

# npm
npx astro add astro-resend-router

# yarn
yarn astro add astro-resend-router
```

Or install it **manually**:

1. Install the required dependencies

```bash
# pnpm
pnpm add astro-resend-router

# npm
npm install astro-resend-router

# yarn
yarn add astro-resend-router
```

2. Add the integration to your Astro config

```diff
+import resendRouter from "astro-resend-router";

export default defineConfig({
  integrations: [
+    resendRouter(),
  ],
});
```

### Configuration

Configuration is validated at build time using Zod. Invalid configuration will fail the Astro build.

#### Configure Resend

1. [Create an API key](https://resend.com/docs/dashboard/api-keys/introduction#what-is-an-api-key) and add to your `.env`:

```bash
RESEND_API_KEY=your_api_key
```

2. [Create a webhook](https://resend.com/docs/webhooks/introduction):

- Endpoint URL: `your_domain/api/astro-resend-router`
- Events: `email.received`
- Add the signing secret to your `.env` for [Webhook verification](https://resend.com/docs/webhooks/verify-webhooks-requests#verify-webhooks-requests)

```bash
RESEND_WEBHOOK_SECRET=your_webhook_signing_secret
```

3. Add contacts to your [Audience](https://resend.com/docs/dashboard/audiences/introduction#your-resend-audience)

4. Configure [Segments](https://resend.com/docs/dashboard/segments/introduction#managing-segments) and [Topics](https://resend.com/docs/knowledge-base/why-use-topics#why-and-when-to-use-topics)

#### Configure the integration options

##### Routing Model

Incoming email addresses are matched to slugs using the local part (everything before `@`). Segment and topic slugs are matched case-insensitively.

Addresses are parsed as: `[action].[segment].[topic]@domain.com`

| Email address                         | Result                                            |
| ------------------------------------- | ------------------------------------------------- |
| `mine@yourdomain.com`                 | Broadcast to the `mine` segment                   |
| `mine.newsletter@yourdomain.com`      | Broadcast to the `newsletter` topic within `mine` |
| `join.mine@yourdomain.com`            | Subscribe sender to the `mine` segment            |
| `join.mine.newsletter@yourdomain.com` | Subscribe to the `newsletter` topic               |

##### Integration Options

```typescript
export default defineConfig({
  integrations: [
    resendRouter({
      segments: [
        {
          segmentName: 'My segment',
          segmentSlug: 'mine',
          segmentId: 'segment_id_from_resend',
          sendFromEmail: {
            name: 'Your Name',
            email: 'hello@yourdomain.com'
          },
          authorizedSenders: ['you@yourdomain.com', 'someone.else@yourdomain.com'],
          allowPublicJoin: true,
          syncContactsProviders: ["pco"],
          customEmailFooter: `
            <p style="font-size:12px; color:#666; line-height:1.5; margin-top:16px;">
              You’re receiving this because you subscribed to our newsletter.<br />
              Want to stop receiving these emails?<br />
            <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#666;">
              Unsubscribe instantly.
            </a>
            </p>`
          topics: [
            {
              topicName: 'Newsletter',
              topicSlug: 'newsletter',
              topicId: 'topic_id_from_resend'
            }
          ]
        }
      ]
    })
  ]
});
```

##### Segment options

`segmentName`: Display-friendly name.

- Does not need to match the segment name in Resend.

```typescript
segmentName: "My Segment";
```

`segmentSlug`: Slug used to match the recipient address.

- Does not need to match the segment name in Resend.
- Matched case insensitively.
- Segment slugs must be unique. Duplicate slugs will throw a configuration error at build time.

```typescript
segmentSlug: "mine"; // matches mine@yourdomain.com
```

`segmentId`: Resend audience segment ID.

- Find it in Resend by navigating to Segments and clicking `...` next to the target segment.

```typescript
segmentId: "segment_id_from_resend";
```

`sendFromEmail`: Sender identity used for outgoing broadcasts from this segment and its topics.

- `name` is the display name shown in the recipient's email client.
- `email` must use a [domain verified in Resend.](https://resend.com/docs/dashboard/domains/introduction#verifying-a-domain)

```typescript
sendFromEmail: {
  name: "Your Name",
  email: "hello@yourdomain.com",
};
```

`authorizedSenders` (optional): List of email addresses allowed to initiate broadcasts for this segment/topics.

- The integration also checks [Contact Properties](https://resend.com/docs/dashboard/audiences/properties#contact-properties) for `authorized_senders = "true"`

```typescript
authorizedSenders: ["you@yourdomain.com"];
```

`allowPublicJoin` (optional): Allow anyone to self-subscribe by emailing a `join`-prefixed address.

- Default: `false`
- Examples:
  - `join.mine@yourdomain.com` -> subscribes to segment `mine`
  - `join.mine.newsletter@yourdomain.com` -> subscribes to segment `mine` and topic `newsletter`

```typescript
allowPublicJoin: true;
```

`syncContactsProviders` (optional): Array of contact provider slugs.

- Enables one-way synchronization from external contact providers into the Resend Segment immediately before a broadcast is sent.
- Must match built-in or custom slug from `customSyncProviders`
- Only the "pco" slug (for syncing Planning Center Online) is built-in.
- See readme for more details on adding a custom provider.

`customEmailFooter` (optional): Custom HTML footer to replace the default footer appended to every broadcast email.

⚠️ Important:

- Must be valid HTML (email-safe markup recommended)
- Must include a Resend unsubscribe placeholder {{{RESEND_UNSUBSCRIBE_URL}}}
- Must contain at least one `<a>` tag
- Will be appended as-is (no sanitization or wrapping is applied)

```ts
customEmailFooter: `
  <hr style="margin-top:24px;border:none;border-top:1px solid #444;" />
  <p style="font-size:12px; color:#666; line-height:1.5; margin-top:16px;">
  You’re receiving this because you subscribed to our newsletter.<br />
	Want to stop receiving these emails?<br />
	  <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#666;">
			Unsubscribe instantly.
		</a>
	</p>
	`;
```

`topics` (optional): Defines topics within a segment.

- `topicName`: Display-friendly name.
- `topicSlug`: Slug matched after the segment name. Does not need to match the topic name in Resend. Topic slugs must be unique. Duplicate slugs will throw a configuration error at build time.
- `topicId`: Find it in Resend by navigating to Topics and clicking ... next to the target topic.

```typescript
topics: [
  {
    topicName: "Newsletter",
    topicSlug: "newsletter",
    topicId: "topic_id_from_resend",
  },
];
```

##### customSyncProviders

See [Configuring Sync Providers](#configuring-sync-providers) below.

#### Added privacy for email addresses (optional)

To avoid committing email addresses to a public repo, consider storing authorized senders in your `.env` file.

```bash
WHATEVER_KEY_YOU_WANT=you@yourdomain.com,another_user@yourdomain.com
```

Then import to astro.config.mjs:

```typescript
const { WHATEVER_KEY_YOU_WANT } = loadEnv("", process.cwd(), "");

export default defineConfig({
  integrations: [
    resendRouter({
      segments: [
          ...
          authorizedSenders: WHATEVER_KEY_YOU_WANT?.split(",").map(e => e.trim()) ?? []
      ]
    })
  ]
});
```

#### Local testing (optional)

1. Set up [Ngrok](https://ngrok.com/) (or a similar tunneling tool).
2. [Create a Webhook](https://resend.com/docs/webhooks/introduction) using your ngrok URL

- Endpoint URL: `ngrok_url/api/astro-resend-router`

3. Allow the host in `astro.config.mjs`:

```typescript
export default defineConfig({
  vite: {
    server: {
      allowedHosts: ["ngrok_url"],
    },
  },
});
```

#### Configuring Sync Providers

A sync provider allows you to define how contacts are fetched and integrated into a segment.

##### Built In Provider

Planning Center Online is a built in sync provider.

To enable:

1. Follow the instructions for [Getting Started with Planning Center API](https://api.planningcenteronline.com/docs/overview/getting-started). Create a Personal Access Token and copy the Client ID and Secret for the next step.
2. Set `PCO_CLIENT_ID` and `PCO_SECRET` as env variables.
3. Set `syncContactsProviders: ["pco"]` in the desired segment.

##### Creating and Using Custom Sync Providers

A valid provider consists of three parts:

1. Define fetch logic.
   Create a function responsible for retrieving contacts and returning them in the `SourceContact` format.

2. Wrap in provider object
   Create a file that exports a `provider` object conforming to the `ContactsProvider` type

Requirements:

- Must include a unique `slug`
- Must include a `getContacts` async function
- getContacts should wrap your fetch function (from step 1)
- Must return ok(contacts) or err(error)

```typescript
//example-provider.ts

import { err, ok, type ContactsProvider } from "astro-resend-router";

const getPeopleWithEmails = async () => {
  const fail = false;

  if (fail) {
    return err({
      code: "failure",
      message: "example failure",
      statusCode: 400,
    });
  }

  return ok([
    {
      email: "user@example.com",
      firstName: "Example",
      lastName: "User",
      source: "example-provider",
    },
  ]);
};

export const provider = {
  slug: "example",
  getContacts: async () => {
    const res = await getPeopleWithEmails();

    if (!res.ok) {
      return err({
        code: "example_get_error",
        message: res.error.message,
        statusCode: res.error.statusCode,
      });
    }

    return ok(res.value);
  },
} satisfies ContactsProvider;
```

3. Register the provider in your config
   The provider must be registered two places:

- By **slug** in the syncContactsProviders field of a segment.
- By **file path** in the customSyncProviders general config field.

```typescript
// astro.config.mjs
export default defineConfig({
  integrations: [
    resendRouter({
      segments: [
        {
          segmentName: 'My segment',
          ...
          syncContactsProviders: ["example"],
          ...
          topics: [...]
        }
      ],
      customSyncProviders: ["./src/lib/providers/example-provider.ts"],
    })
  ]
});
```

## Contributing

### Issues

Submit issues to [astro-resend-router/issues](https://github.com/tmykkanen/astro-resend-router/issues).

### Development

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm:

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/tmykkanen/astro-resend-router?tab=MIT-1-ov-file). Made with ❤️ by [Tyler Mykkanen](https://github.com/tmykkanen).

## Acknowledgements

- Created using [astro-integration-template](https://github.com/florian-lefebvre/astro-integration-template).
