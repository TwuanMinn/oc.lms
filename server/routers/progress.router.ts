import { z } from "zod";
import { router, protectedProcedure } from "@/server/trpc";
import * as progressService from "@/server/services/progress.service";
import * as notificationService from "@/server/services/notification.service";

export const progressRouter = router({
  markComplete: protectedProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        lessonId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await progressService.markLessonComplete(
        ctx.user.id,
        input.courseId,
        input.lessonId
      );

      if (!result.alreadyComplete && result.percent === 100) {
        await notificationService.createNotification(
          ctx.user.id,
          "COURSE_COMPLETE",
          "Course completed! 🎉",
          "Congratulations! You've finished all lessons in this course.",
          `/dashboard/student`
        );
      }

      return result;
    }),

  getCourseProgress: protectedProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      return progressService.getCourseProgressPercent(ctx.user.id, input.courseId);
    }),

  getResumeLesson: protectedProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      return progressService.getResumeLesson(ctx.user.id, input.courseId);
    }),

  getCompletedLessons: protectedProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      return progressService.getCompletedLessons(ctx.user.id, input.courseId);
    }),
});
