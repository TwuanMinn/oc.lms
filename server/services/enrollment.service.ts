import "server-only";
import { TRPCError } from "@trpc/server";
import { eq, and, sql, count } from "drizzle-orm";
import { db } from "@/server/db";
import { enrollments, progress } from "@/server/db/schema/learning";
import { courses, lessons } from "@/server/db/schema/courses";
import { hasActiveSubscription } from "./billing.service";

export async function enroll(userId: string, courseId: string) {
  const [existing] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))
    );

  if (existing) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Already enrolled in this course",
    });
  }

  const [enrollment] = await db
    .insert(enrollments)
    .values({ userId, courseId })
    .returning({
      id: enrollments.id,
      enrolledAt: enrollments.enrolledAt,
    });

  return enrollment;
}

export async function unenroll(userId: string, courseId: string) {
  const [existing] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))
    );

  if (!existing) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Not enrolled" });
  }

  await db.delete(enrollments).where(eq(enrollments.id, existing.id));
  return { success: true };
}

export async function checkAccess(
  userId: string | undefined,
  lessonId: string
): Promise<boolean> {
  const [lesson] = await db
    .select({ isFree: lessons.isFree, courseId: lessons.courseId })
    .from(lessons)
    .where(eq(lessons.id, lessonId));

  if (!lesson) return false;
  if (lesson.isFree) return true;
  if (!userId) return false;

  const hasSub = await hasActiveSubscription(userId);
  if (hasSub) return true;

  const [enrollment] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, lesson.courseId)
      )
    );

  return !!enrollment;
}

export async function getEnrolledCourses(userId: string) {
  const enrolled = await db
    .select({
      enrollmentId: enrollments.id,
      courseId: enrollments.courseId,
      enrolledAt: enrollments.enrolledAt,
      completedAt: enrollments.completedAt,
      courseTitle: courses.title,
      courseSlug: courses.slug,
      courseThumbnail: courses.thumbnail,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, userId));

  // Calculate progress for each enrollment
  const withProgress = await Promise.all(
    enrolled.map(async (e) => {
      const [completedResult, totalResult] = await Promise.all([
        db
          .select({ count: count() })
          .from(progress)
          .where(
            and(eq(progress.userId, userId), eq(progress.courseId, e.courseId))
          ),
        db
          .select({ count: count() })
          .from(lessons)
          .where(eq(lessons.courseId, e.courseId)),
      ]);

      const completed = completedResult[0]?.count ?? 0;
      const total = totalResult[0]?.count ?? 0;
      const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { ...e, progressPercent };
    })
  );

  return withProgress;
}

export async function getRecommendedCourses(userId: string) {
  // Get courses the user is NOT enrolled in, ordered by popularity
  const results = await db
    .select({
      id: courses.id,
      slug: courses.slug,
      title: courses.title,
      description: courses.description,
      thumbnail: courses.thumbnail,
      price: courses.price,
      enrollmentCount: sql<number>`(SELECT count(*) FROM enrollments WHERE enrollments.course_id = courses.id)`,
    })
    .from(courses)
    .where(
      and(
        eq(courses.status, "PUBLISHED"),
        sql`${courses.deletedAt} IS NULL`,
        sql`${courses.id} NOT IN (SELECT course_id FROM enrollments WHERE user_id = ${userId})`
      )
    )
    .orderBy(sql`(SELECT count(*) FROM enrollments WHERE enrollments.course_id = courses.id) DESC`)
    .limit(6);

  return results;
}
