import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { welcomeEmail } from "@/inngest/functions/welcome-email";
import { completionCertificate } from "@/inngest/functions/completion-certificate";
import { expireSubscriptions } from "@/inngest/functions/expire-subscriptions";
import { cleanupNotifications } from "@/inngest/functions/cleanup-notifications";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    welcomeEmail,
    completionCertificate,
    expireSubscriptions,
    cleanupNotifications,
  ],
});
