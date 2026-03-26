import { z } from "zod";
import { router, publicProcedure, teacherProcedure } from "@/server/trpc";
import { createCourseSchema, updateCourseSchema, courseListSchema } from "@/lib/validations/course";
import * as courseService from "@/server/services/course.service";

export const courseRouter = router({
  categories: publicProcedure.query(async () => {
    return courseService.getCategories();
  }),

  list: publicProcedure.input(courseListSchema).query(async ({ input }) => {
    return courseService.getCatalog(input);
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;
      return courseService.getCourseBySlug(input.slug, userId);
    }),

  create: teacherProcedure
    .input(createCourseSchema)
    .mutation(async ({ input, ctx }) => {
      return courseService.createCourse(ctx.user.id, input);
    }),

  update: teacherProcedure
    .input(updateCourseSchema)
    .mutation(async ({ input, ctx }) => {
      const role = (ctx.user as Record<string, unknown>).role as string;
      return courseService.updateCourse(ctx.user.id, role, input);
    }),

  publish: teacherProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const role = (ctx.user as Record<string, unknown>).role as string;
      return courseService.publishCourse(input.id, ctx.user.id, role);
    }),

  delete: teacherProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const role = (ctx.user as Record<string, unknown>).role as string;
      return courseService.deleteCourse(input.id, ctx.user.id, role);
    }),

  myCoursesAsTeacher: teacherProcedure.query(async ({ ctx }) => {
    return courseService.getTeacherCourses(ctx.user.id);
  }),
});
