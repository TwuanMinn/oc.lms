import { inngest } from "../client";

export const welcomeEmail = inngest.createFunction(
  { id: "welcome-email", name: "Send Welcome Email" },
  { event: "user/registered" },
  async ({ event }) => {
    const { email, name } = event.data as { email: string; name: string };

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_xxxxxxxxxxxx") {
      console.log(`[SKIP] Welcome email to ${email} — RESEND_API_KEY not configured`);
      return { skipped: true };
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "LMS <noreply@lms.dev>",
      to: email,
      subject: `Welcome to LMS, ${name}!`,
      html: `
        <h1>Welcome, ${name}! 🎉</h1>
        <p>Your account has been created. Start exploring courses now.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses">Browse Courses →</a>
      `,
    });

    return { sent: true, to: email };
  }
);
