import "server-only";
import { eq, and, asc, sql, count } from "drizzle-orm";
import { db } from "@/server/db";
import { progress } from "@/server/db/schema/learning";
import { lessons, modules } from "@/server/db/schema/courses";
import { enrollments } from "@/server/db/schema/learning";

export async function markLessonComplete(
  userId: string,
  courseId: string,
  lessonId: string
) {
  const [existing] = await db
    .select({ id: progress.id })
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.lessonId, lessonId)));

  if (existing) return { alreadyComplete: true };

  await db.insert(progress).values({ userId, courseId, lessonId });

  const percent = await getCourseProgressPercent(userId, courseId);
  if (percent === 100) {
    await db
      .update(enrollments)
      .set({ completedAt: new Date() })
      .where(
        and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))
      );
  }

  return { alreadyComplete: false, percent };
}

export async function getCourseProgressPercent(
  userId: string,
  courseId: string
): Promise<number> {
  const [completedResult, totalResult] = await Promise.all([
    db
      .select({ count: count() })
      .from(progress)
      .where(
        and(eq(progress.userId, userId), eq(progress.courseId, courseId))
      ),
    db
      .select({ count: count() })
      .from(lessons)
      .where(eq(lessons.courseId, courseId)),
  ]);

  const completed = completedResult[0]?.count ?? 0;
  const total = totalResult[0]?.count ?? 0;

  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export async function getResumeLesson(userId: string, courseId: string) {
  const completedLessons = await db
    .select({ lessonId: progress.lessonId })
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.courseId, courseId)));

  const completedIds = new Set(completedLessons.map((p) => p.lessonId));

  const allLessons = await db
    .select({
      id: lessons.id,
      title: lessons.title,
      modulePosition: modules.position,
      lessonPosition: lessons.position,
    })
    .from(lessons)
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(modules.position), asc(lessons.position));

  const firstIncomplete = allLessons.find((l) => !completedIds.has(l.id));
  return firstIncomplete ?? allLessons[0] ?? null;
}

export async function getCompletedLessons(userId: string, courseId: string) {
  const completed = await db
    .select({ lessonId: progress.lessonId })
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.courseId, courseId)));

  return completed.map((p) => p.lessonId);
}
