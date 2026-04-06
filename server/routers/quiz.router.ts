import { z } from "zod";
import { router, protectedProcedure, teacherProcedure } from "@/server/trpc";
import { createQuizSchema, createQuestionSchema, submitQuizSchema } from "@/lib/validations/quiz";
import * as quizService from "@/server/services/quiz.service";

// #11: create/addQuestion now pass ctx.user for ownership verification
export const quizRouter = router({
  getQuiz: protectedProcedure
    .input(z.object({ quizId: z.string().uuid() }))
    .query(async ({ input }) => {
      return quizService.getQuizForStudent(input.quizId);
    }),

  getByLessonId: protectedProcedure
    .input(z.object({ lessonId: z.string().uuid() }))
    .query(async ({ input }) => {
      return quizService.getQuizByLessonId(input.lessonId);
    }),

  submit: protectedProcedure
    .input(submitQuizSchema)
    .mutation(async ({ input, ctx }) => {
      return quizService.gradeQuiz(ctx.user.id, input);
    }),

  create: teacherProcedure
    .input(createQuizSchema)
    .mutation(async ({ input, ctx }) => {
      return quizService.createQuiz(input, ctx.user.id, ctx.user.role);
    }),

  addQuestion: teacherProcedure
    .input(createQuestionSchema)
    .mutation(async ({ input, ctx }) => {
      return quizService.addQuestion(input, ctx.user.id, ctx.user.role);
    }),
});
