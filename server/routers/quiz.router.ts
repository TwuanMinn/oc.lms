import { z } from "zod";
import { router, protectedProcedure, teacherProcedure } from "@/server/trpc";
import { createQuizSchema, createQuestionSchema, submitQuizSchema } from "@/lib/validations/quiz";
import * as quizService from "@/server/services/quiz.service";
import { db } from "@/server/db";
import { quizzes, questions } from "@/server/db/schema/quizzes";

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
    .mutation(async ({ input }) => {
      const [quiz] = await db
        .insert(quizzes)
        .values(input)
        .returning({ id: quizzes.id, title: quizzes.title });
      return quiz;
    }),

  addQuestion: teacherProcedure
    .input(createQuestionSchema)
    .mutation(async ({ input }) => {
      const [question] = await db
        .insert(questions)
        .values(input)
        .returning({ id: questions.id, text: questions.text });
      return question;
    }),
});
