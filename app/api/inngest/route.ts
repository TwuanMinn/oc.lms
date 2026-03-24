import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { welcomeEmail } from "@/inngest/functions/welcome-email";
import { completionCertificate } from "@/inngest/functions/completion-certificate";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [welcomeEmail, completionCertificate],
});
