import { z } from "zod";

const optionSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
});

export const createQuizSchema = z.object({
  lessonId: z.string().uuid(),
  title: z.string().min(1).max(200),
  instructions: z.string().max(2000).optional(),
  passingScore: z.number().min(0).max(100).default(70),
  timeLimitMinutes: z.number().min(1).max(480).optional(),
  availableFrom: z.string().optional(),
  availableUntil: z.string().optional(),
});

export const createQuestionSchema = z.object({
  quizId: z.string().uuid(),
  text: z.string().min(1).max(2000),
  type: z.enum(["MCQ", "MULTI"]),
  options: z.array(optionSchema).min(2).max(10),
  correctOptions: z.array(z.string()).min(1),
  position: z.number().min(0),
});

export const submitQuizSchema = z.object({
  quizId: z.string().uuid(),
  answers: z.array(
    z.object({
      questionId: z.string().uuid(),
      selectedOptions: z.array(z.string()),
    })
  ),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
