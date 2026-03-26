import "server-only";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { enrollments } from "@/server/db/schema/learning";
import { lessons } from "@/server/db/schema/courses";
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

  // Subscription grants access to ALL courses
  const hasSub = await hasActiveSubscription(userId);
  if (hasSub) return true;

  // Fallback: per-course enrollment
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
    })
    .from(enrollments)
    .where(eq(enrollments.userId, userId));

  return enrolled;
}
