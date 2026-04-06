import "server-only";
import { TRPCError } from "@trpc/server";
import { eq, and, asc, sql, inArray } from "drizzle-orm";
import { db } from "@/server/db";
import { lessons, modules, courses } from "@/server/db/schema/courses";
import type {
  CreateLessonInput,
  UpdateLessonInput,
  CreateModuleInput,
} from "@/lib/validations/lesson";

/**
 * Verifies the calling teacher owns the course.
 * Admins bypass this check.
 */
export async function verifyCourseOwnership(
  courseId: string,
  teacherId: string,
  role: string
) {
  if (role === "ADMIN") return;
  const [course] = await db
    .select({ teacherId: courses.teacherId })
    .from(courses)
    .where(eq(courses.id, courseId));
  if (!course || course.teacherId !== teacherId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You don't own this course",
    });
  }
}

export async function createLesson(
  input: CreateLessonInput,
  teacherId: string,
  role: string
) {
  await verifyCourseOwnership(input.courseId, teacherId, role);
  return db.transaction(async (tx) => {
    const [lesson] = await tx
      .insert(lessons)
      .values(input)
      .returning({
        id: lessons.id,
        title: lessons.title,
        position: lessons.position,
      });

    if (input.duration > 0) {
      await tx
        .update(courses)
        .set({
          totalDuration: sql`${courses.totalDuration} + ${input.duration}`,
        })
        .where(eq(courses.id, input.courseId));
    }

    return lesson;
  });
}

export async function updateLesson(
  input: UpdateLessonInput,
  teacherId: string,
  role: string
) {
  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: lessons.id, duration: lessons.duration, courseId: lessons.courseId })
      .from(lessons)
      .where(eq(lessons.id, input.id));

    if (!existing) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found" });
    }

    await verifyCourseOwnership(existing.courseId, teacherId, role);

    const { id, ...data } = input;
    // #8: Auto-filter undefined fields — no manual if-chains to maintain
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    );

    const [updated] = await tx
      .update(lessons)
      .set(updateData)
      .where(eq(lessons.id, id))
      .returning({
        id: lessons.id,
        title: lessons.title,
      });

    if (data.duration !== undefined && data.duration !== existing.duration) {
      const diff = data.duration - existing.duration;
      await tx
        .update(courses)
        .set({
          totalDuration: sql`greatest(0, ${courses.totalDuration} + ${diff})`,
        })
        .where(eq(courses.id, existing.courseId));
    }

    return updated;
  });
}

export async function reorderLessons(
  items: Array<{ id: string; position: number }>,
  teacherId: string,
  role: string
) {
  if (items.length === 0) return { success: true };

  // Verify ownership: check the first lesson's course
  const [firstLesson] = await db
    .select({ courseId: lessons.courseId })
    .from(lessons)
    .where(eq(lessons.id, items[0].id));
  if (firstLesson) {
    await verifyCourseOwnership(firstLesson.courseId, teacherId, role);
  }

  // #5: Batch update with a single SQL CASE instead of N sequential UPDATEs
  const ids = items.map((i) => i.id);
  const cases = items.map((i) => sql`WHEN ${i.id}::uuid THEN ${i.position}`);
  await db.execute(sql`
    UPDATE lessons SET position = CASE id
      ${sql.join(cases, sql` `)}
    END
    WHERE id = ANY(ARRAY[${sql.join(ids.map((id) => sql`${id}::uuid`), sql`, `)}])
  `);
  return { success: true };
}

export async function createModule(
  input: CreateModuleInput,
  teacherId: string,
  role: string
) {
  await verifyCourseOwnership(input.courseId, teacherId, role);
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

export async function updateModule(
  id: string,
  title: string,
  teacherId: string,
  role: string
) {
  const [mod] = await db
    .select({ courseId: modules.courseId })
    .from(modules)
    .where(eq(modules.id, id));
  if (mod) await verifyCourseOwnership(mod.courseId, teacherId, role);

  const [updated] = await db
    .update(modules)
    .set({ title })
    .where(eq(modules.id, id))
    .returning({ id: modules.id, title: modules.title });
  return updated;
}

export async function reorderModules(
  items: Array<{ id: string; position: number }>,
  teacherId: string,
  role: string
) {
  if (items.length === 0) return { success: true };

  // Verify ownership
  const [firstMod] = await db
    .select({ courseId: modules.courseId })
    .from(modules)
    .where(eq(modules.id, items[0].id));
  if (firstMod) {
    await verifyCourseOwnership(firstMod.courseId, teacherId, role);
  }

  // #5: Batch update
  const ids = items.map((i) => i.id);
  const cases = items.map((i) => sql`WHEN ${i.id}::uuid THEN ${i.position}`);
  await db.execute(sql`
    UPDATE modules SET position = CASE id
      ${sql.join(cases, sql` `)}
    END
    WHERE id = ANY(ARRAY[${sql.join(ids.map((id) => sql`${id}::uuid`), sql`, `)}])
  `);
  return { success: true };
}

export async function deleteModule(
  moduleId: string,
  teacherId: string,
  role: string
) {
  const [mod] = await db
    .select({ courseId: modules.courseId })
    .from(modules)
    .where(eq(modules.id, moduleId));
  if (mod) await verifyCourseOwnership(mod.courseId, teacherId, role);

  return db.transaction(async (tx) => {
    const moduleLessons = await tx
      .select({ duration: lessons.duration, courseId: lessons.courseId })
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId));

    if (moduleLessons.length > 0) {
      const totalDuration = moduleLessons.reduce((sum, l) => sum + l.duration, 0);
      const courseId = moduleLessons[0].courseId;
      await tx
        .update(courses)
        .set({
          totalDuration: sql`greatest(0, ${courses.totalDuration} - ${totalDuration})`,
        })
        .where(eq(courses.id, courseId));
    }

    await tx.delete(modules).where(eq(modules.id, moduleId));
    return { success: true };
  });
}

export async function deleteLesson(
  lessonId: string,
  teacherId: string,
  role: string
) {
  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ duration: lessons.duration, courseId: lessons.courseId })
      .from(lessons)
      .where(eq(lessons.id, lessonId));

    if (!existing) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Lesson not found" });
    }

    await verifyCourseOwnership(existing.courseId, teacherId, role);

    await tx.delete(lessons).where(eq(lessons.id, lessonId));

    if (existing.duration > 0) {
      await tx
        .update(courses)
        .set({
          totalDuration: sql`greatest(0, ${courses.totalDuration} - ${existing.duration})`,
        })
        .where(eq(courses.id, existing.courseId));
    }

    return { success: true };
  });
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
