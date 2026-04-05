import "server-only";
import { eq, and, count, desc, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { certificates, learningStreaks } from "@/server/db/schema/learning";
import { courses } from "@/server/db/schema/courses";
import { users } from "@/server/db/schema/users";
import { TRPCError } from "@trpc/server";

function generateCertificateNumber(): string {
  const prefix = "GA";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function issueCertificate(userId: string, courseId: string) {
  const [existing] = await db
    .select({ id: certificates.id })
    .from(certificates)
    .where(
      and(eq(certificates.userId, userId), eq(certificates.courseId, courseId))
    );

  if (existing) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Certificate already issued for this course",
    });
  }

  const [cert] = await db
    .insert(certificates)
    .values({
      userId,
      courseId,
      certificateNumber: generateCertificateNumber(),
    })
    .returning();

  return cert;
}

export async function getUserCertificates(userId: string) {
  const certs = await db
    .select({
      id: certificates.id,
      certificateNumber: certificates.certificateNumber,
      issuedAt: certificates.issuedAt,
      courseId: certificates.courseId,
      courseTitle: courses.title,
      courseSlug: courses.slug,
      teacherName: users.name,
    })
    .from(certificates)
    .innerJoin(courses, eq(certificates.courseId, courses.id))
    .leftJoin(users, eq(courses.teacherId, users.id))
    .where(eq(certificates.userId, userId))
    .orderBy(desc(certificates.issuedAt));

  return certs;
}

export async function getCertificateCount(userId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(certificates)
    .where(eq(certificates.userId, userId));
  return result?.count ?? 0;
}

export async function getCertificateById(certificateId: string) {
  const [cert] = await db
    .select({
      id: certificates.id,
      certificateNumber: certificates.certificateNumber,
      issuedAt: certificates.issuedAt,
      studentName: users.name,
      courseTitle: courses.title,
    })
    .from(certificates)
    .innerJoin(users, eq(certificates.userId, users.id))
    .innerJoin(courses, eq(certificates.courseId, courses.id))
    .where(eq(certificates.id, certificateId));

  return cert ?? null;
}

export async function recordActivity(userId: string) {
  const today = new Date().toISOString().split("T")[0];
  await db
    .insert(learningStreaks)
    .values({ userId, activityDate: today, lessonsCompleted: 1 })
    .onConflictDoUpdate({
      target: [learningStreaks.userId, learningStreaks.activityDate],
      set: {
        lessonsCompleted: sql`${learningStreaks.lessonsCompleted} + 1`,
      },
    });
}

export async function getStreakData(userId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const startDate = thirtyDaysAgo.toISOString().split("T")[0];

  const recentActivity = await db
    .select({
      activityDate: learningStreaks.activityDate,
      lessonsCompleted: learningStreaks.lessonsCompleted,
    })
    .from(learningStreaks)
    .where(
      and(
        eq(learningStreaks.userId, userId),
        sql`${learningStreaks.activityDate} >= ${startDate}`
      )
    )
    .orderBy(desc(learningStreaks.activityDate));

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  const checkDate = new Date(today);
  const activeDates = new Set(recentActivity.map((r) => r.activityDate));

  for (let i = 0; i < 30; i++) {
    const dateStr = checkDate.toISOString().split("T")[0];
    if (activeDates.has(dateStr)) {
      currentStreak++;
    } else if (i > 0) {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return {
    currentStreak,
    totalDays: recentActivity.length,
    recentActivity: recentActivity.map((r) => ({
      date: r.activityDate,
      count: r.lessonsCompleted,
    })),
  };
}
