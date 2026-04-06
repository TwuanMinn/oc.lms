import { z } from "zod";
import { router, protectedProcedure, teacherProcedure } from "@/server/trpc";
import {
  createLessonSchema,
  updateLessonSchema,
  reorderLessonsSchema,
  createModuleSchema,
  updateModuleSchema,
  reorderModulesSchema,
} from "@/lib/validations/lesson";
import * as lessonService from "@/server/services/lesson.service";
import * as enrollmentService from "@/server/services/enrollment.service";
import { TRPCError } from "@trpc/server";

export const lessonRouter = router({
  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const hasAccess = await enrollmentService.checkAccess(
        ctx.user.id,
        input.id
      );
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You need to enroll to access this lesson",
        });
      }
      return lessonService.getLessonById(input.id);
    }),

  create: teacherProcedure
    .input(createLessonSchema)
    .mutation(async ({ input, ctx }) => {
      return lessonService.createLesson(input, ctx.user.id, ctx.user.role);
    }),

  update: teacherProcedure
    .input(updateLessonSchema)
    .mutation(async ({ input, ctx }) => {
      return lessonService.updateLesson(input, ctx.user.id, ctx.user.role);
    }),

  delete: teacherProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      return lessonService.deleteLesson(input.id, ctx.user.id, ctx.user.role);
    }),

  reorder: teacherProcedure
    .input(reorderLessonsSchema)
    .mutation(async ({ input, ctx }) => {
      return lessonService.reorderLessons(input.items, ctx.user.id, ctx.user.role);
    }),

  createModule: teacherProcedure
    .input(createModuleSchema)
    .mutation(async ({ input, ctx }) => {
      return lessonService.createModule(input, ctx.user.id, ctx.user.role);
    }),

  updateModule: teacherProcedure
    .input(updateModuleSchema)
    .mutation(async ({ input, ctx }) => {
      return lessonService.updateModule(input.id, input.title ?? "", ctx.user.id, ctx.user.role);
    }),

  deleteModule: teacherProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      return lessonService.deleteModule(input.id, ctx.user.id, ctx.user.role);
    }),

  reorderModules: teacherProcedure
    .input(reorderModulesSchema)
    .mutation(async ({ input, ctx }) => {
      return lessonService.reorderModules(input.items, ctx.user.id, ctx.user.role);
    }),
});
