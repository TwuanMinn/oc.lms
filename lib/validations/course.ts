import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().max(5000).optional(),
  categoryId: z.string().uuid().optional(),
  thumbnail: z.string().url().optional(),

});

export const updateCourseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(5000).optional(),
  categoryId: z.string().uuid().nullable().optional(),
  thumbnail: z.string().url().nullable().optional(),

  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export const courseListSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  search: z.string().max(200).optional(),
  categoryId: z.string().uuid().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  sort: z.enum(["newest", "popular", "rating"]).default("newest"),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CourseListInput = z.infer<typeof courseListSchema>;
