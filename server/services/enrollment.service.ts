import "server-only";
import { TRPCError } from "@trpc/server";
import { eq, and, sql, isNull } from "drizzle-orm";
import { db } from "@/server/db";
import { enrollments, progress } from "@/server/db/schema/learning";
import { courses, lessons } from "@/server/db/schema/courses";
import { hasActiveSubscription } from "./billing.service";

// #7: Validate course is PUBLISHED and not deleted before enrollment
export async function enroll(userId: string, courseId: string) {
  const [course] = await db
    .select({ status: courses.status, deletedAt: courses.deletedAt })
    .from(courses)
    .where(eq(courses.id, courseId));

  if (!course || course.deletedAt || course.status !== "PUBLISHED") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Course is not available for enrollment",
    });
  }

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

// P1: Fixed N+1 — replaced Promise.all(enrolled.map(...)) with a single batch query
export async function getEnrolledCourses(userId: string) {
  const rows = await db.execute(sql`
    SELECT
      e.id AS "enrollmentId",
      e.course_id AS "courseId",
      e.enrolled_at AS "enrolledAt",
      e.completed_at AS "completedAt",
      c.title AS "courseTitle",
      c.slug AS "courseSlug",
      c.thumbnail AS "courseThumbnail",
      COALESCE(pc.completed_count, 0)::int AS "completedCount",
      COALESCE(lc.total_count, 0)::int AS "totalCount",
      CASE
        WHEN COALESCE(lc.total_count, 0) = 0 THEN 0
        ELSE ROUND((COALESCE(pc.completed_count, 0)::numeric / lc.total_count) * 100)::int
      END AS "progressPercent"
    FROM enrollments e
    INNER JOIN courses c ON c.id = e.course_id
    LEFT JOIN LATERAL (
      SELECT count(*) AS completed_count
      FROM progress p
      WHERE p.user_id = ${userId} AND p.course_id = e.course_id
    ) pc ON true
    LEFT JOIN LATERAL (
      SELECT count(*) AS total_count
      FROM lessons l
      WHERE l.course_id = e.course_id
    ) lc ON true
    WHERE e.user_id = ${userId}
    ORDER BY e.enrolled_at DESC
  `);

  return [...(rows as unknown as Record<string, unknown>[])];
}

// #4: Replaced raw sql`deletedAt IS NULL` and NOT IN subquery with Drizzle ORM helpers
export async function getRecommendedCourses(userId: string) {
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
        isNull(courses.deletedAt),
        sql`NOT EXISTS (SELECT 1 FROM enrollments WHERE enrollments.course_id = ${courses.id} AND enrollments.user_id = ${userId})`
      )
    )
    .orderBy(sql`(SELECT count(*) FROM enrollments WHERE enrollments.course_id = courses.id) DESC`)
    .limit(6);

  return results;
}
