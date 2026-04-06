import "server-only";
import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { bookmarks } from "@/server/db/schema/social";
import { lessons, courses } from "@/server/db/schema/courses";

// #6: Race-condition-safe toggle using delete-first pattern
export async function toggleBookmark(userId: string, lessonId: string) {
  const deleted = await db
    .delete(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.lessonId, lessonId)))
    .returning({ id: bookmarks.id });

  if (deleted.length > 0) {
    return { bookmarked: false };
  }

  // ON CONFLICT DO NOTHING handles rare race where two inserts slip through
  await db
    .insert(bookmarks)
    .values({ userId, lessonId })
    .onConflictDoNothing({ target: [bookmarks.userId, bookmarks.lessonId] });

  return { bookmarked: true };
}

export async function isBookmarked(
  userId: string,
  lessonId: string
): Promise<{ bookmarked: boolean }> {
  const [existing] = await db
    .select({ id: bookmarks.id })
    .from(bookmarks)
    .where(
      and(eq(bookmarks.userId, userId), eq(bookmarks.lessonId, lessonId))
    );
  return { bookmarked: !!existing };
}

export async function getUserBookmarks(userId: string) {
  return db
    .select({
      id: bookmarks.id,
      lessonId: bookmarks.lessonId,
      lessonTitle: lessons.title,
      courseId: lessons.courseId,
      courseTitle: courses.title,
      courseSlug: courses.slug,
      createdAt: bookmarks.createdAt,
    })
    .from(bookmarks)
    .innerJoin(lessons, eq(bookmarks.lessonId, lessons.id))
    .innerJoin(courses, eq(lessons.courseId, courses.id))
    .where(eq(bookmarks.userId, userId));
}
