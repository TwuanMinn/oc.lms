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
    .mutation(async ({ input }) => {
      return lessonService.createLesson(input);
    }),

  update: teacherProcedure
    .input(updateLessonSchema)
    .mutation(async ({ input }) => {
      return lessonService.updateLesson(input);
    }),

  delete: teacherProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return lessonService.deleteLesson(input.id);
    }),

  reorder: teacherProcedure
    .input(reorderLessonsSchema)
    .mutation(async ({ input }) => {
      return lessonService.reorderLessons(input.items);
    }),

  createModule: teacherProcedure
    .input(createModuleSchema)
    .mutation(async ({ input }) => {
      return lessonService.createModule(input);
    }),

  updateModule: teacherProcedure
    .input(updateModuleSchema)
    .mutation(async ({ input }) => {
      return lessonService.updateModule(input.id, input.title ?? "");
    }),

  deleteModule: teacherProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return lessonService.deleteModule(input.id);
    }),

  reorderModules: teacherProcedure
    .input(reorderModulesSchema)
    .mutation(async ({ input }) => {
      return lessonService.reorderModules(input.items);
    }),
});
