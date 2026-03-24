import "server-only";
import { eq, and, isNull, desc, count } from "drizzle-orm";
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

export async function getUnreadNotifications(userId: string) {
  const unread = await db
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
    .limit(20);

  return unread;
}

export async function getUnreadCount(userId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
  return result?.count ?? 0;
}

export async function markAllRead(userId: string) {
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
  return { success: true };
}

export async function markRead(notificationId: string) {
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(eq(notifications.id, notificationId));
  return { success: true };
}
