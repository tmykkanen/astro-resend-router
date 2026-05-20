import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import resendRouter from "astro-resend-router";

export default defineConfig({
  integrations: [
    resendRouter({
      segments: [
        {
          name: "test",
          segmentId: "test_id",
          topics: [
            {
              name: "testTopic",
              topicId: "test_topic_id",
            },
          ],
          allowPublicJoin: true,
          sendFromEmail: {
            name: "Your Name",
            email: "you@yourdomain.com",
          },
          authorizedSenders: ["someone@somedomain.com"],
        },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
