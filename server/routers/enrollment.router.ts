import { z } from "zod";
import { router, protectedProcedure } from "@/server/trpc";
import * as enrollmentService from "@/server/services/enrollment.service";
import * as notificationService from "@/server/services/notification.service";

export const enrollmentRouter = router({
  enroll: protectedProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const result = await enrollmentService.enroll(ctx.user.id, input.courseId);
      await notificationService.createNotification(
        ctx.user.id,
        "ENROLLMENT",
        "Successfully enrolled!",
        "You have been enrolled in a new course. Start learning now!",
        `/dashboard/student`
      );
      return result;
    }),

  unenroll: protectedProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      return enrollmentService.unenroll(ctx.user.id, input.courseId);
    }),

  myEnrollments: protectedProcedure.query(async ({ ctx }) => {
    return enrollmentService.getEnrolledCourses(ctx.user.id);
  }),

  recommended: protectedProcedure.query(async ({ ctx }) => {
    return enrollmentService.getRecommendedCourses(ctx.user.id);
  }),
});
