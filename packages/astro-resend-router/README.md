# `astro-resend-router`

An [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that turns [Resend](https://resend.com/) into a lightweight mailing list system by using a webhook and API endpoint.

## Usage

### Prerequisites

- [Resend](https://resend.com/) account

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

2. Add the integration to your astro config

```diff
+import resendRouter from "astro-resend-router";

export default defineConfig({
  integrations: [
+    resendRouter(),
  ],
});
```

### Configuration

#### Configure Resend

1. [Verify your domain](https://resend.com/docs/dashboard/domains/introduction#verifying-a-domain)

2. [Create an API key](https://resend.com/docs/dashboard/api-keys/introduction#what-is-an-api-key) and add to your `.env`:

```bash
RESEND_API_KEY=your_api_key
```

3. [Create a webhook](https://resend.com/docs/webhooks/introduction):

- Endpoint URL: `your_domain/api/astro-resend-router`
- Events: `email.received`
- Add the signing secret to your `.env` for [Webhook verification](https://resend.com/docs/webhooks/verify-webhooks-requests#verify-webhooks-requests)

```bash
RESEND_WEBHOOK_SECRET=your_webhook_signing_secret
```

4. Add contacts to your [Audience](https://resend.com/docs/dashboard/audiences/introduction#your-resend-audience)

5. Configure [Segments](https://resend.com/docs/dashboard/segments/introduction#managing-segments) and [Topics](https://resend.com/docs/knowledge-base/why-use-topics#why-and-when-to-use-topics)

#### Configure the integration options

```typescript
export default defineConfig({
  integrations: [
    resendRouter({
      segments: [...],
      sendFromEmail: {...},
      authorizedSenders: [...],
      allowPublicJoin: ...,
    })
  ]
});
```

**Options**

`segments` (required): Defines how incoming emails are routed.

- The local part of the email address determines the segment:
  - `pfi@yourdomain.com` → `pfi` segment
- Topics can be matched using dot notation:
  - `pfi.newsletter@yourdomain.com` → `newsletter` topic in `pfi`

```typescript
segments: [
  {
    name: "pfi",
    segmentId: "segment_id_from_resend",
    topics: [
      {
        name: "newsletter",
        topicId: "topic_id_from_resend",
      },
    ],
  },
];
```

`sendFromEmail` (required): Sender identity used for outgoing broadcasts.

- email must be a verified sender in Resend

```typescript
sendFromEmail: {
  name: 'Your App',
  email: 'no-reply@yourdomain.com'
}
```

`authorizedSenders` (optional): List of email addresses allowed to send broadcasts.

- Integration also checks [Contact Properties](https://resend.com/docs/dashboard/audiences/properties#contact-properties) in Resend for `authorized_senders = 'true'`

```typescript
authorizedSenders: ["you@yourdomain.com"];
```

`allowPublicJoin` (optional): Allow users to subscribe by sending an email.

- Default: `false`
- Examples:
  - `join.pfi@yourdomain.com` -> subscribes to segment `pfi`
  - `join.pfi.newsletter@yourdomain.com` -> subscribes to segment `pfi` and topic `newsletter`

```typescript
allowPublicJoin: true;
```

#### Routing Summary

| Email address                        | Result                                                       |
| ------------------------------------ | ------------------------------------------------------------ |
| `pfi@yourdomain.com`                 | Send to `pfi` segment                                        |
| `pfi.newsletter@yourdomain.com`      | Send to `newsletter` topic                                   |
| `join.pfi@yourdomain.com`            | Subscribe to segment `pfi` (if `allowPublicJoin: true`)      |
| `join.pfi.newsletter@yourdomain.com` | Subscribe to topic `newsletter` (if `allowPublicJoin: true`) |

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

## Contributing

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
