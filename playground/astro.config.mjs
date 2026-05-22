import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import resendRouter from "astro-resend-router";
import { loadEnv } from "vite";

// For Local Dev, set NGROK_HOST from .env
const { NGROK_HOST, MY_AUTHORIZED_SENDERS } = loadEnv("", process.cwd(), "");

export default defineConfig({
  integrations: [
    resendRouter({
      segments: [
        {
          segmentName: "Astro Resend Test",
          segmentIdentifier: "test",
          segmentId: "720e6fd0-85d1-4745-af43-e6c7e2851b4d",
          topics: [
            {
              topicName: "Test Topic",
              topicIdentifier: "news",
              topicId: "0a5a62c7-e4e1-4d87-9bfc-7e01c2102c1f",
            },
          ],
          allowPublicJoin: true,
          authorizedSenders:
            MY_AUTHORIZED_SENDERS?.split(",").map((e) => e.trim()) ?? [],
          sendFromEmail: {
            name: "RESEND TEST",
            email: "hello@updates.sojourners.church",
          },
        },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [NGROK_HOST],
    },
  },
});
