import { z } from "zod";
import { eq, isNull, sql, count, desc } from "drizzle-orm";
import { router, adminProcedure } from "@/server/trpc";
import { db } from "@/server/db";
import { users } from "@/server/db/schema/users";
import { courses } from "@/server/db/schema/courses";
import { enrollments } from "@/server/db/schema/learning";

export const adminRouter = router({
  getUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        role: z.enum(["ADMIN", "TEACHER", "STUDENT"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const conditions = [isNull(users.deletedAt)];
      if (input.role) {
        conditions.push(eq(users.role, input.role));
      }

      const [userList, totalResult] = await Promise.all([
        db
          .select({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            createdAt: users.createdAt,
            emailVerified: users.emailVerified,
          })
          .from(users)
          .where(sql`${sql.join(conditions, sql` AND `)}`)
          .limit(input.limit)
          .offset(input.offset)
          .orderBy(desc(users.createdAt)),
        db
          .select({ count: count() })
          .from(users)
          .where(sql`${sql.join(conditions, sql` AND `)}`),
      ]);

      return { users: userList, total: totalResult[0]?.count ?? 0 };
    }),

  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        role: z.enum(["ADMIN", "TEACHER", "STUDENT"]),
      })
    )
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.userId))
        .returning({ id: users.id, role: users.role });
      return updated;
    }),

  deleteUser: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db
        .update(users)
        .set({ deletedAt: new Date() })
        .where(eq(users.id, input.userId));
      return { success: true };
    }),

  getCourses: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const [courseList, totalResult] = await Promise.all([
        db
          .select({
            id: courses.id,
            title: courses.title,
            slug: courses.slug,
            status: courses.status,
            teacherName: users.name,
            createdAt: courses.createdAt,
            enrollmentCount: sql<number>`(SELECT count(*) FROM enrollments WHERE enrollments.course_id = courses.id)`,
          })
          .from(courses)
          .leftJoin(users, eq(courses.teacherId, users.id))
          .where(isNull(courses.deletedAt))
          .orderBy(desc(courses.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        db
          .select({ count: count() })
          .from(courses)
          .where(isNull(courses.deletedAt)),
      ]);

      return { courses: courseList, total: totalResult[0]?.count ?? 0 };
    }),

  getAnalytics: adminProcedure.query(async () => {
    const [totalUsers, totalCourses, totalEnrollments, enrollmentsByDay, topCourses] =
      await Promise.all([
        db.select({ count: count() }).from(users).where(isNull(users.deletedAt)),
        db.select({ count: count() }).from(courses).where(isNull(courses.deletedAt)),
        db.select({ count: count() }).from(enrollments),
        db
          .select({
            date: sql<string>`date(${enrollments.enrolledAt})`,
            count: count(),
          })
          .from(enrollments)
          .where(
            sql`${enrollments.enrolledAt} >= now() - interval '30 days'`
          )
          .groupBy(sql`date(${enrollments.enrolledAt})`)
          .orderBy(sql`date(${enrollments.enrolledAt})`),
        db
          .select({
            courseId: courses.id,
            title: courses.title,
            enrollmentCount: sql<number>`(SELECT count(*) FROM enrollments WHERE enrollments.course_id = courses.id)`,
          })
          .from(courses)
          .where(isNull(courses.deletedAt))
          .orderBy(
            sql`(SELECT count(*) FROM enrollments WHERE enrollments.course_id = courses.id) DESC`
          )
          .limit(5),
      ]);

    return {
      totalUsers: totalUsers[0]?.count ?? 0,
      totalCourses: totalCourses[0]?.count ?? 0,
      totalEnrollments: totalEnrollments[0]?.count ?? 0,
      enrollmentsByDay,
      topCourses,
    };
  }),
});
