import { z } from "zod";

export const createLessonSchema = z.object({
  moduleId: z.string().uuid(),
  courseId: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  videoUrl: z.string().url().optional(),
  content: z.string().max(50000).optional(),
  duration: z.number().min(0).default(0),
  position: z.number().min(0),
  isFree: z.boolean().default(false),
});

export const updateLessonSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  content: z.string().max(50000).nullable().optional(),
  duration: z.number().min(0).optional(),
  isFree: z.boolean().optional(),
});

export const reorderLessonsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().min(0),
    })
  ),
});

export const createModuleSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(200),
  position: z.number().min(0),
});

export const updateModuleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
});

export const reorderModulesSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().min(0),
    })
  ),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type CreateModuleInput = z.infer<typeof createModuleSchema>;
