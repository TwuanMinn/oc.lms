import { inngest } from "@/inngest/client";
import { sql } from "drizzle-orm";
import { db } from "@/server/db";

/**
 * #10: Expire overdue subscriptions.
 * Runs daily at 2 AM UTC — transitions ACTIVE subscriptions past their endDate to EXPIRED.
 */
export const expireSubscriptions = inngest.createFunction(
  { id: "expire-subscriptions", name: "Expire Overdue Subscriptions" },
  { cron: "0 2 * * *" },
  async () => {
    const result = await db.execute(sql`
      UPDATE subscriptions
      SET status = 'EXPIRED'
      WHERE status = 'ACTIVE'
        AND end_date IS NOT NULL
        AND end_date < NOW()
    `);
    const count = result.length;
    console.log("[Cron] Expired subscriptions:", count);
    return { expired: count };
  }
);
