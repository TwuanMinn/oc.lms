import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { router, protectedProcedure } from "@/server/trpc";
import { db } from "@/server/db";
import { bookmarks } from "@/server/db/schema/social";
import { lessons, courses } from "@/server/db/schema/courses";

export const bookmarkRouter = router({
  toggle: protectedProcedure
    .input(z.object({ lessonId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const [existing] = await db
        .select({ id: bookmarks.id })
        .from(bookmarks)
        .where(
          and(
            eq(bookmarks.userId, ctx.user.id),
            eq(bookmarks.lessonId, input.lessonId)
          )
        );

      if (existing) {
        await db.delete(bookmarks).where(eq(bookmarks.id, existing.id));
        return { bookmarked: false };
      }

      await db.insert(bookmarks).values({
        userId: ctx.user.id,
        lessonId: input.lessonId,
      });
      return { bookmarked: true };
    }),

  isBookmarked: protectedProcedure
    .input(z.object({ lessonId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const [existing] = await db
        .select({ id: bookmarks.id })
        .from(bookmarks)
        .where(
          and(
            eq(bookmarks.userId, ctx.user.id),
            eq(bookmarks.lessonId, input.lessonId)
          )
        );
      return { bookmarked: !!existing };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userBookmarks = await db
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
      .where(eq(bookmarks.userId, ctx.user.id));

    return userBookmarks;
  }),
});
