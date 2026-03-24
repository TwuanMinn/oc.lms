import "server-only";
import { TRPCError } from "@trpc/server";
import { eq, and, asc, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { lessons, modules, courses } from "@/server/db/schema/courses";
import type {
  CreateLessonInput,
  UpdateLessonInput,
  CreateModuleInput,
} from "@/lib/validations/lesson";

export async function createLesson(input: CreateLessonInput) {
  const [lesson] = await db
    .insert(lessons)
    .values(input)
    .returning({
      id: lessons.id,
      title: lessons.title,
      position: lessons.position,
    });

  if (input.duration > 0) {
    await db
      .update(courses)
      .set({
        totalDuration: sql`${courses.totalDuration} + ${input.duration}`,
      })
      .where(eq(courses.id, input.courseId));
  }

  return lesson;
}

export async function updateLesson(input: UpdateLessonInput) {
  const [existing] = await db
    .select({ id: lessons.id, duration: lessons.duration, courseId: lessons.courseId })
    .from(lessons)
    .where(eq(lessons.id, input.id));

  if (!existing) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found" });
  }

  const { id, ...data } = input;
  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.duration !== undefined) updateData.duration = data.duration;
  if (data.isFree !== undefined) updateData.isFree = data.isFree;

  const [updated] = await db
    .update(lessons)
    .set(updateData)
    .where(eq(lessons.id, id))
    .returning({
      id: lessons.id,
      title: lessons.title,
    });

  if (data.duration !== undefined && data.duration !== existing.duration) {
    const diff = data.duration - existing.duration;
    await db
      .update(courses)
      .set({
        totalDuration: sql`greatest(0, ${courses.totalDuration} + ${diff})`,
      })
      .where(eq(courses.id, existing.courseId));
  }

  return updated;
}

export async function reorderLessons(items: Array<{ id: string; position: number }>) {
  await Promise.all(
    items.map((item) =>
      db
        .update(lessons)
        .set({ position: item.position })
        .where(eq(lessons.id, item.id))
    )
  );
  return { success: true };
}

export async function createModule(input: CreateModuleInput) {
  const [mod] = await db
    .insert(modules)
    .values(input)
    .returning({
      id: modules.id,
      title: modules.title,
      position: modules.position,
    });
  return mod;
}

export async function updateModule(id: string, title: string) {
  const [updated] = await db
    .update(modules)
    .set({ title })
    .where(eq(modules.id, id))
    .returning({ id: modules.id, title: modules.title });
  return updated;
}

export async function reorderModules(items: Array<{ id: string; position: number }>) {
  await Promise.all(
    items.map((item) =>
      db
        .update(modules)
        .set({ position: item.position })
        .where(eq(modules.id, item.id))
    )
  );
  return { success: true };
}

export async function deleteModule(moduleId: string) {
  const moduleLessons = await db
    .select({ duration: lessons.duration, courseId: lessons.courseId })
    .from(lessons)
    .where(eq(lessons.moduleId, moduleId));

  if (moduleLessons.length > 0) {
    const totalDuration = moduleLessons.reduce((sum, l) => sum + l.duration, 0);
    const courseId = moduleLessons[0].courseId;
    await db
      .update(courses)
      .set({
        totalDuration: sql`greatest(0, ${courses.totalDuration} - ${totalDuration})`,
      })
      .where(eq(courses.id, courseId));
  }

  await db.delete(modules).where(eq(modules.id, moduleId));
  return { success: true };
}

export async function deleteLesson(lessonId: string) {
  const [existing] = await db
    .select({ duration: lessons.duration, courseId: lessons.courseId })
    .from(lessons)
    .where(eq(lessons.id, lessonId));

  if (!existing) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found" });
  }

  await db.delete(lessons).where(eq(lessons.id, lessonId));

  if (existing.duration > 0) {
    await db
      .update(courses)
      .set({
        totalDuration: sql`greatest(0, ${courses.totalDuration} - ${existing.duration})`,
      })
      .where(eq(courses.id, existing.courseId));
  }

  return { success: true };
}

export async function getLessonById(lessonId: string) {
  const [lesson] = await db
    .select({
      id: lessons.id,
      title: lessons.title,
      description: lessons.description,
      videoUrl: lessons.videoUrl,
      content: lessons.content,
      duration: lessons.duration,
      position: lessons.position,
      isFree: lessons.isFree,
      moduleId: lessons.moduleId,
      courseId: lessons.courseId,
    })
    .from(lessons)
    .where(eq(lessons.id, lessonId));

  if (!lesson) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found" });
  }

  return lesson;
}
