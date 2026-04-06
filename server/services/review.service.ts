import "server-only";
import { TRPCError } from "@trpc/server";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/server/db";
import { reviews } from "@/server/db/schema/social";
import { courses } from "@/server/db/schema/courses";
import { enrollments } from "@/server/db/schema/learning";
import { users } from "@/server/db/schema/users";

export async function createReview(
  userId: string,
  input: { courseId: string; rating: number; body?: string }
) {
  // #2: Verify the user is enrolled before allowing a review
  const [enrollment] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(eq(enrollments.userId, userId), eq(enrollments.courseId, input.courseId))
    );

  if (!enrollment) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You must be enrolled in this course to leave a review",
    });
  }

  const [existing] = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(
      and(eq(reviews.userId, userId), eq(reviews.courseId, input.courseId))
    );

  if (existing) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "You already reviewed this course",
    });
  }

  const [review] = await db
    .insert(reviews)
    .values({
      userId,
      courseId: input.courseId,
      rating: input.rating,
      body: input.body,
    })
    .returning({ id: reviews.id, rating: reviews.rating });

  const [course] = await db
    .select({ teacherId: courses.teacherId, title: courses.title })
    .from(courses)
    .where(eq(courses.id, input.courseId));

  return { review, course };
}

export async function updateReview(
  userId: string,
  input: { id: string; rating?: number; body?: string }
) {
  const [existing] = await db
    .select({ userId: reviews.userId })
    .from(reviews)
    .where(eq(reviews.id, input.id));

  if (!existing || existing.userId !== userId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your review" });
  }

  // #8: Use Object.fromEntries instead of manual field-by-field
  const updateData = Object.fromEntries(
    Object.entries({ rating: input.rating, body: input.body }).filter(
      ([, v]) => v !== undefined
    )
  );

  const [updated] = await db
    .update(reviews)
    .set(updateData)
    .where(eq(reviews.id, input.id))
    .returning({ id: reviews.id, rating: reviews.rating });

  return updated;
}

export async function getReviewsByCourse(input: {
  courseId: string;
  limit: number;
  offset: number;
}) {
  return db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      body: reviews.body,
      createdAt: reviews.createdAt,
      userName: users.name,
      userAvatar: users.avatar,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.courseId, input.courseId))
    .orderBy(desc(reviews.createdAt))
    .limit(input.limit)
    .offset(input.offset);
}
