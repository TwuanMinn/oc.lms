import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "@/server/trpc";
import * as reviewService from "@/server/services/review.service";
import * as notificationService from "@/server/services/notification.service";

// #1/#9: Fully delegated to review.service — no inline DB logic
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
      const { review, course } = await reviewService.createReview(
        ctx.user.id,
        input
      );

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
      return reviewService.updateReview(ctx.user.id, input);
    }),

  getByCourse: publicProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      return reviewService.getReviewsByCourse(input);
    }),
});
