import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { router, protectedProcedure } from "@/server/trpc";
import { db } from "@/server/db";
import { reviews } from "@/server/db/schema/social";
import { users } from "@/server/db/schema/users";
import { courses } from "@/server/db/schema/courses";
import { TRPCError } from "@trpc/server";
import * as notificationService from "@/server/services/notification.service";

export const reviewRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        rating: z.number().int().min(1).max(5),
        body: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [existing] = await db
        .select({ id: reviews.id })
        .from(reviews)
        .where(
          and(
            eq(reviews.userId, ctx.user.id),
            eq(reviews.courseId, input.courseId)
          )
        );

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already reviewed this course",
        });
      }

      const [review] = await db
        .insert(reviews)
        .values({
          userId: ctx.user.id,
          courseId: input.courseId,
          rating: input.rating,
          body: input.body,
        })
        .returning({
          id: reviews.id,
          rating: reviews.rating,
        });

      // Notify the course teacher about the new review
      const [course] = await db
        .select({ teacherId: courses.teacherId, title: courses.title })
        .from(courses)
        .where(eq(courses.id, input.courseId));

      if (course && course.teacherId !== ctx.user.id) {
        await notificationService.createNotification(
          course.teacherId,
          "NEW_REVIEW",
          `New ${input.rating}★ review`,
          `Someone left a review on "${course.title}"`,
          `/courses/${input.courseId}`
        );
      }

      return review;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        rating: z.number().int().min(1).max(5).optional(),
        body: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [existing] = await db
        .select({ userId: reviews.userId })
        .from(reviews)
        .where(eq(reviews.id, input.id));

      if (!existing || existing.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your review" });
      }

      const updateData: Record<string, unknown> = {};
      if (input.rating !== undefined) updateData.rating = input.rating;
      if (input.body !== undefined) updateData.body = input.body;

      const [updated] = await db
        .update(reviews)
        .set(updateData)
        .where(eq(reviews.id, input.id))
        .returning({ id: reviews.id, rating: reviews.rating });

      return updated;
    }),

  getByCourse: protectedProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const courseReviews = await db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          body: reviews.body,
          createdAt: reviews.createdAt,
          userName: users.name,
          userAvatar: users.avatar,
        })
        .from(reviews)
        .innerJoin(users, eq(reviews.userId, users.id))
        .where(eq(reviews.courseId, input.courseId))
        .orderBy(desc(reviews.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return courseReviews;
    }),
});
