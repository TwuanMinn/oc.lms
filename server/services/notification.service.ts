import "server-only";
import { eq, and, isNull, desc, count, lt } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { notifications } from "@/server/db/schema/social";

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body: string,
  link?: string
) {
  const [notification] = await db
    .insert(notifications)
    .values({ userId, type, title, body, link })
    .returning({
      id: notifications.id,
      title: notifications.title,
      createdAt: notifications.createdAt,
    });
  return notification;
}

// #17: Accept limit/offset instead of hard-coded 20
export async function getUnreadNotifications(
  userId: string,
  limit = 20,
  offset = 0
) {
  return db
    .select({
      id: notifications.id,
      type: notifications.type,
      title: notifications.title,
      body: notifications.body,
      link: notifications.link,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)))
    .orderBy(desc(notifications.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getUnreadCount(userId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
  return result?.count ?? 0;
}

// #10: Get all notifications (including read) with pagination
export async function getAllNotifications(
  userId: string,
  limit = 20,
  offset = 0
) {
  return db
    .select({
      id: notifications.id,
      type: notifications.type,
      title: notifications.title,
      body: notifications.body,
      link: notifications.link,
      readAt: notifications.readAt,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function markAllRead(userId: string) {
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
  return { success: true };
}

// #5: Atomic single-query markRead — eliminates TOCTOU race condition
export async function markRead(notificationId: string, userId: string) {
  const [updated] = await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      )
    )
    .returning({ id: notifications.id });

  if (!updated) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Notification not found",
    });
  }
  return { success: true };
}

// #10: Delete a single notification (ownership enforced atomically)
export async function deleteNotification(
  notificationId: string,
  userId: string
) {
  const [deleted] = await db
    .delete(notifications)
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      )
    )
    .returning({ id: notifications.id });

  if (!deleted) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Notification not found",
    });
  }
  return { success: true };
}

// #13: Cleanup utility — delete notifications older than N days
export async function deleteOldNotifications(days = 90) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const result = await db
    .delete(notifications)
    .where(lt(notifications.createdAt, cutoff))
    .returning({ id: notifications.id });

  return { deleted: result.length };
}
