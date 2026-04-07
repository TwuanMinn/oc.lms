import "server-only";
import { TRPCError } from "@trpc/server";
import { eq, asc, and } from "drizzle-orm";
import { db } from "@/server/db";
import { quizzes, questions, quizAttempts } from "@/server/db/schema/quizzes";
import { lessons } from "@/server/db/schema/courses";
import { verifyCourseOwnership } from "./lesson.service";
import type { SubmitQuizInput } from "@/lib/validations/quiz";

export async function getQuizForStudent(quizId: string) {
  const [quiz] = await db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      instructions: quizzes.instructions,
      passingScore: quizzes.passingScore,
      timeLimitMinutes: quizzes.timeLimitMinutes,
      availableFrom: quizzes.availableFrom,
      availableUntil: quizzes.availableUntil,
      lessonId: quizzes.lessonId,
    })
    .from(quizzes)
    .where(eq(quizzes.id, quizId));

  if (!quiz) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Quiz not found" });
  }

  // Check availability window
  const now = new Date();
  if (quiz.availableFrom && now < quiz.availableFrom) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `This test opens on ${quiz.availableFrom.toLocaleDateString()}`,
    });
  }
  if (quiz.availableUntil && now > quiz.availableUntil) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "This test is no longer available",
    });
  }

  const quizQuestions = await db
    .select({
      id: questions.id,
      text: questions.text,
      type: questions.type,
      options: questions.options,
      position: questions.position,
    })
    .from(questions)
    .where(eq(questions.quizId, quizId))
    .orderBy(asc(questions.position));

  return {
    ...quiz,
    questions: quizQuestions,
  };
}

export async function getQuizByLessonId(lessonId: string) {
  const [quiz] = await db
    .select({ id: quizzes.id, title: quizzes.title, passingScore: quizzes.passingScore })
    .from(quizzes)
    .where(eq(quizzes.lessonId, lessonId));

  return quiz ?? null;
}

export async function gradeQuiz(
  userId: string,
  input: SubmitQuizInput
) {
  const [quiz] = await db
    .select({ id: quizzes.id, passingScore: quizzes.passingScore })
    .from(quizzes)
    .where(eq(quizzes.id, input.quizId));

  if (!quiz) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Quiz not found" });
  }

  // Enforce no retakes — check if student already took this quiz
  const [existingAttempt] = await db
    .select({ id: quizAttempts.id })
    .from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, input.quizId)));

  if (existingAttempt) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You have already taken this test. Retakes are not allowed.",
    });
  }

  const quizQuestions = await db
    .select({
      id: questions.id,
      correctOptions: questions.correctOptions,
    })
    .from(questions)
    .where(eq(questions.quizId, input.quizId));

  const correctMap = new Map(
    quizQuestions.map((q) => [q.id, q.correctOptions])
  );

  let correctCount = 0;
  const feedback: Array<{
    questionId: string;
    correct: boolean;
    correctOptions: string[];
  }> = [];

  for (const answer of input.answers) {
    const correctOpts = correctMap.get(answer.questionId);
    if (!correctOpts) continue;

    const isCorrect =
      correctOpts.length === answer.selectedOptions.length &&
      correctOpts.every((opt) => answer.selectedOptions.includes(opt));

    if (isCorrect) correctCount++;

    feedback.push({
      questionId: answer.questionId,
      correct: isCorrect,
      correctOptions: correctOpts,
    });
  }

  const totalQuestions = quizQuestions.length;
  const score = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= quiz.passingScore;

  const [attempt] = await db
    .insert(quizAttempts)
    .values({
      userId,
      quizId: input.quizId,
      answers: input.answers,
      score,
      passed,
    })
    .returning({
      id: quizAttempts.id,
      score: quizAttempts.score,
      passed: quizAttempts.passed,
    });

  return { ...attempt, feedback };
}

export async function createQuiz(
  input: {
    lessonId: string;
    title: string;
    instructions?: string;
    passingScore?: number;
    timeLimitMinutes?: number;
    availableFrom?: string;
    availableUntil?: string;
  },
  teacherId: string,
  role: string
) {
  const [lesson] = await db
    .select({ courseId: lessons.courseId })
    .from(lessons)
    .where(eq(lessons.id, input.lessonId));

  if (!lesson) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found" });
  }

  await verifyCourseOwnership(lesson.courseId, teacherId, role);

  const [quiz] = await db
    .insert(quizzes)
    .values({
      lessonId: input.lessonId,
      title: input.title,
      instructions: input.instructions || null,
      passingScore: input.passingScore ?? 70,
      timeLimitMinutes: input.timeLimitMinutes || null,
      availableFrom: input.availableFrom ? new Date(input.availableFrom) : null,
      availableUntil: input.availableUntil ? new Date(input.availableUntil) : null,
    })
    .returning({ id: quizzes.id, title: quizzes.title });
  return quiz;
}

// #11: Verify the teacher owns the parent course before adding a question
export async function addQuestion(
  input: {
    quizId: string;
    text: string;
    type: "MCQ" | "MULTI";
    options: Array<{ id: string; text: string }>;
    correctOptions: string[];
    position: number;
  },
  teacherId: string,
  role: string
) {
  const [quiz] = await db
    .select({ lessonId: quizzes.lessonId })
    .from(quizzes)
    .where(eq(quizzes.id, input.quizId));

  if (!quiz) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Quiz not found" });
  }

  const [lesson] = await db
    .select({ courseId: lessons.courseId })
    .from(lessons)
    .where(eq(lessons.id, quiz.lessonId));

  if (!lesson) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found" });
  }

  await verifyCourseOwnership(lesson.courseId, teacherId, role);

  const [question] = await db
    .insert(questions)
    .values(input)
    .returning({ id: questions.id, text: questions.text });
  return question;
}
