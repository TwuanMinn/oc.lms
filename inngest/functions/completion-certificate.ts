import { inngest } from "../client";

export const completionCertificate = inngest.createFunction(
  { id: "completion-certificate", name: "Generate Completion Certificate" },
  { event: "course/completed" },
  async ({ event }) => {
    const { userId, courseId, courseName, userName } = event.data as {
      userId: string;
      courseId: string;
      courseName: string;
      userName: string;
    };

    console.log(
      `[CERT] Generating certificate for ${userName} — Course: ${courseName}`
    );

    // In production: generate PDF certificate, upload to storage, create notification
    // For now: create a notification
    const { db } = await import("@/server/db");
    const { notifications } = await import("@/server/db/schema/social");

    await db.insert(notifications).values({
      userId,
      type: "CERTIFICATE",
      title: "Course completed! 🎓",
      body: `Congratulations! You completed "${courseName}". Your certificate is ready.`,
      link: `/dashboard/student`,
    });

    return { generated: true, userId, courseId };
  }
);
