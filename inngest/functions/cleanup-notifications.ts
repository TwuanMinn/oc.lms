import { inngest } from "@/inngest/client";
import { sql } from "drizzle-orm";
import { db } from "@/server/db";

/**
 * #7: Clean up old read notifications.
 * Runs daily at 3 AM UTC — deletes read notifications older than 90 days.
 */
export const cleanupNotifications = inngest.createFunction(
  { id: "cleanup-notifications", name: "Cleanup Old Notifications" },
  { cron: "0 3 * * *" },
  async () => {
    const result = await db.execute(sql`
      DELETE FROM notifications
      WHERE read_at IS NOT NULL
        AND created_at < NOW() - INTERVAL '90 days'
    `);
    const count = result.length;
    console.log("[Cron] Cleaned notifications:", count);
    return { deleted: count };
  }
);
