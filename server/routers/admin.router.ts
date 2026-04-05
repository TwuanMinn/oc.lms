import { z } from "zod";
import { eq, isNull, sql, count, desc, and, or, ilike, gte } from "drizzle-orm";
import { router, adminProcedure } from "@/server/trpc";
import { db } from "@/server/db";
import { users, accounts } from "@/server/db/schema/users";
import { courses, categories } from "@/server/db/schema/courses";
import { enrollments } from "@/server/db/schema/learning";
import { platformSettings } from "@/server/db/schema/platform";

export const adminRouter = router({
  // ── OVERVIEW ──
  getOverview: adminProcedure.query(async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsersResult,
      totalCoursesResult,
      totalRevenueResult,
      newEnrollmentsResult,
      latestUsers,
      latestCourses,
    ] = await Promise.all([
      db.select({ count: count() }).from(users).where(isNull(users.deletedAt)),
      db
        .select({ count: count() })
        .from(courses)
        .where(and(isNull(courses.deletedAt), eq(courses.status, "PUBLISHED"))),
      db.execute(
        sql`SELECT COALESCE(SUM(CAST(c.price AS numeric)), 0)::float AS total FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE c.deleted_at IS NULL`
      ),
      db
        .select({ count: count() })
        .from(enrollments)
        .where(gte(enrollments.enrolledAt, startOfMonth)),
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          avatar: users.avatar,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(isNull(users.deletedAt))
        .orderBy(desc(users.createdAt))
        .limit(10),
      db
        .select({
          id: courses.id,
          title: courses.title,
          slug: courses.slug,
          teacherName: users.name,
          createdAt: courses.createdAt,
        })
        .from(courses)
        .leftJoin(users, eq(courses.teacherId, users.id))
        .where(and(isNull(courses.deletedAt), eq(courses.status, "PUBLISHED")))
        .orderBy(desc(courses.createdAt))
        .limit(10),
    ]);

    const revenueRow = totalRevenueResult as unknown as { total: number }[];
    return {
      totalUsers: totalUsersResult[0]?.count ?? 0,
      totalCourses: totalCoursesResult[0]?.count ?? 0,
      totalRevenue: revenueRow[0]?.total ?? 0,
      newEnrollments: newEnrollmentsResult[0]?.count ?? 0,
      latestUsers,
      latestCourses,
    };
  }),

  // ── USERS ──
  getUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        role: z.enum(["ADMIN", "TEACHER", "STUDENT"]).optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const conditions = [isNull(users.deletedAt)];
      if (input.role) conditions.push(eq(users.role, input.role));
      if (input.search) {
        conditions.push(
          or(
            ilike(users.name, `%${input.search}%`),
            ilike(users.email, `%${input.search}%`)
          )!
        );
      }
      const whereClause = and(...conditions);

      const [userList, totalResult] = await Promise.all([
        db
          .select({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            avatar: users.avatar,
            status: users.status,
            createdAt: users.createdAt,
            emailVerified: users.emailVerified,
          })
          .from(users)
          .where(whereClause)
          .limit(input.limit)
          .offset(input.offset)
          .orderBy(desc(users.createdAt)),
        db.select({ count: count() }).from(users).where(whereClause),
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

  banUser: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db
        .update(users)
        .set({ status: "banned" })
        .where(eq(users.id, input.userId));
      return { success: true };
    }),

  unbanUser: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db
        .update(users)
        .set({ status: "active" })
        .where(eq(users.id, input.userId));
      return { success: true };
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

  createUser: adminProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        role: z.enum(["ADMIN", "TEACHER", "STUDENT"]).default("STUDENT"),
      })
    )
    .mutation(async ({ input }) => {
      const { hashPassword } = await import("better-auth/crypto");
      const passwordHash = await hashPassword(input.password);

      const [newUser] = await db
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
          passwordHash,
          role: input.role,
          emailVerified: true,
        })
        .returning({ id: users.id, name: users.name, email: users.email, role: users.role });

      // Create credential account for better-auth
      await db.insert(accounts).values({
        userId: newUser.id,
        accountId: newUser.id,
        providerId: "credential",
        password: passwordHash,
      });

      return newUser;
    }),

  // ── COURSES ──
  getCourses: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const conditions = [isNull(courses.deletedAt)];
      if (input.status) conditions.push(eq(courses.status, input.status));
      const whereClause = and(...conditions);

      const [courseList, totalResult] = await Promise.all([
        db
          .select({
            id: courses.id,
            title: courses.title,
            slug: courses.slug,
            thumbnail: courses.thumbnail,
            price: courses.price,
            status: courses.status,
            approved: courses.approved,
            teacherName: users.name,
            categoryName: categories.name,
            createdAt: courses.createdAt,
            enrollmentCount:
              sql<number>`(SELECT count(*) FROM enrollments WHERE enrollments.course_id = courses.id)`,
          })
          .from(courses)
          .leftJoin(users, eq(courses.teacherId, users.id))
          .leftJoin(categories, eq(courses.categoryId, categories.id))
          .where(whereClause)
          .orderBy(desc(courses.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        db.select({ count: count() }).from(courses).where(whereClause),
      ]);

      return { courses: courseList, total: totalResult[0]?.count ?? 0 };
    }),

  approveCourse: adminProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db
        .update(courses)
        .set({ approved: true })
        .where(eq(courses.id, input.courseId));
      return { success: true };
    }),

  rejectCourse: adminProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db
        .update(courses)
        .set({ approved: false })
        .where(eq(courses.id, input.courseId));
      return { success: true };
    }),

  forceUnpublishCourse: adminProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db
        .update(courses)
        .set({ status: "DRAFT" })
        .where(eq(courses.id, input.courseId));
      return { success: true };
    }),

  deleteCourse: adminProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db
        .update(courses)
        .set({ deletedAt: new Date() })
        .where(eq(courses.id, input.courseId));
      return { success: true };
    }),

  // ── TRANSACTIONS (simulated from enrollments) ──
  getTransactions: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(200).default(50),
        offset: z.number().min(0).default(0),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const dateConditions: ReturnType<typeof sql>[] = [];
      if (input.dateFrom)
        dateConditions.push(
          sql`e.enrolled_at >= ${input.dateFrom}::timestamptz`
        );
      if (input.dateTo)
        dateConditions.push(
          sql`e.enrolled_at <= ${input.dateTo}::timestamptz`
        );
      const dateFilter =
        dateConditions.length > 0
          ? sql`AND ${sql.join(dateConditions, sql` AND `)}`
          : sql``;

      const transactions = await db.execute(sql`
        SELECT
          e.id,
          s.name AS student_name,
          s.email AS student_email,
          t.name AS teacher_name,
          c.title AS course_title,
          CAST(c.price AS float) AS amount,
          ROUND(CAST(c.price AS numeric) * 0.10, 2)::float AS platform_fee,
          ROUND(CAST(c.price AS numeric) * 0.90, 2)::float AS teacher_payout,
          e.enrolled_at AS date,
          'completed' AS status
        FROM enrollments e
        JOIN courses c ON c.id = e.course_id
        JOIN users s ON s.id = e.user_id
        JOIN users t ON t.id = c.teacher_id
        WHERE c.deleted_at IS NULL ${dateFilter}
        ORDER BY e.enrolled_at DESC
        LIMIT ${input.limit} OFFSET ${input.offset}
      `);

      const summary = await db.execute(sql`
        SELECT
          COALESCE(SUM(CAST(c.price AS float)), 0) AS total_revenue,
          ROUND(COALESCE(SUM(CAST(c.price AS numeric) * 0.10), 0), 2)::float AS total_platform_fees,
          ROUND(COALESCE(SUM(CAST(c.price AS numeric) * 0.90), 0), 2)::float AS total_teacher_payouts,
          COUNT(*)::int AS total_count
        FROM enrollments e
        JOIN courses c ON c.id = e.course_id
        WHERE c.deleted_at IS NULL ${dateFilter}
      `);

      const rows = [...(transactions as unknown as Record<string, unknown>[])];
      const summaryRow = [
        ...(summary as unknown as Record<string, unknown>[]),
      ][0] ?? {
        total_revenue: 0,
        total_platform_fees: 0,
        total_teacher_payouts: 0,
        total_count: 0,
      };

      return { transactions: rows, summary: summaryRow };
    }),

  // ── REPORTS ──
  getReportData: adminProcedure.query(async () => {
    const [monthlyRevenueRaw, topCoursesRaw, userDistributionRaw] =
      await Promise.all([
        db.execute(sql`
        SELECT
          TO_CHAR(e.enrolled_at, 'YYYY-MM') AS month,
          COALESCE(SUM(CAST(c.price AS float)), 0) AS revenue
        FROM enrollments e
        JOIN courses c ON c.id = e.course_id
        WHERE e.enrolled_at >= NOW() - INTERVAL '12 months'
          AND c.deleted_at IS NULL
        GROUP BY TO_CHAR(e.enrolled_at, 'YYYY-MM')
        ORDER BY month
      `),
        db.execute(sql`
        SELECT
          c.title,
          COUNT(e.id)::int AS enrollment_count
        FROM courses c
        LEFT JOIN enrollments e ON e.course_id = c.id
        WHERE c.deleted_at IS NULL
        GROUP BY c.id, c.title
        ORDER BY enrollment_count DESC
        LIMIT 5
      `),
        db.execute(sql`
        SELECT role, COUNT(*)::int AS count
        FROM users
        WHERE deleted_at IS NULL
        GROUP BY role
      `),
      ]);

    return {
      monthlyRevenue: [
        ...(monthlyRevenueRaw as unknown as Record<string, unknown>[]),
      ],
      topCourses: [
        ...(topCoursesRaw as unknown as Record<string, unknown>[]),
      ],
      userDistribution: [
        ...(userDistributionRaw as unknown as Record<string, unknown>[]),
      ],
    };
  }),

  // ── SETTINGS ──
  getSettings: adminProcedure.query(async () => {
    const settings = await db.select().from(platformSettings);
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return map;
  }),

  updateSetting: adminProcedure
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }) => {
      const existing = await db
        .select()
        .from(platformSettings)
        .where(eq(platformSettings.key, input.key));
      if (existing.length > 0) {
        await db
          .update(platformSettings)
          .set({ value: input.value, updatedAt: new Date() })
          .where(eq(platformSettings.key, input.key));
      } else {
        await db
          .insert(platformSettings)
          .values({ key: input.key, value: input.value });
      }
      return { success: true };
    }),

  // Keep legacy analytics for backward compat
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
          .where(sql`${enrollments.enrolledAt} >= now() - interval '30 days'`)
          .groupBy(sql`date(${enrollments.enrolledAt})`)
          .orderBy(sql`date(${enrollments.enrolledAt})`),
        db
          .select({
            courseId: courses.id,
            title: courses.title,
            enrollmentCount:
              sql<number>`(SELECT count(*) FROM enrollments WHERE enrollments.course_id = courses.id)`,
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
