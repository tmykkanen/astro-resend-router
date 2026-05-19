import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import resendRouter from "astro-resend-router";

// https://astro.build/config
export default defineConfig({
  integrations: [
    resendRouter({
      segments: [
        {
          name: "pfi",
          segmentId: "77560301-5283-4931-9c89-4a62b0f5e6a0",
          topics: [
            {
              name: "newsletter",
              topicId: "85ec6b4f-c1d0-4f58-91d4-dbfbe0d3a01c",
            },
          ],
        },
      ],
      allowPublicJoin: true,
      sendFromEmail: {
        name: "Sojourners Church",
        email: "hello@updates.sojourners.church",
      },
      authorizedSenders: [
        "tyler.mykkanen@sojourners.church",
        "adam@redemptionrochester.com",
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ["edgar-persuasive-hudson.ngrok-free.dev"],
    },
  },
});
