import "server-only";
import { eq, isNull, sql, count, desc, and, or, ilike, gte } from "drizzle-orm";
import { db } from "@/server/db";
import { users, accounts } from "@/server/db/schema/users";
import { courses, categories, courseWeeks } from "@/server/db/schema/courses";
import { enrollments } from "@/server/db/schema/learning";
import { classeSessions, attendanceRecords } from "@/server/db/schema/attendance";
import { platformSettings } from "@/server/db/schema/platform";
import { TRPCError } from "@trpc/server";
import { escapeLike, typedRows } from "@/lib/utils";

// ── Typed interfaces for raw SQL returns ──

export interface AdminCourseRow {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;

  status: string;
  approved: boolean;
  teacherName: string | null;
  categoryName: string | null;
  createdAt: Date;
  enrollmentCount: number;
}

export interface TransactionRow {
  id: string;
  student_name: string;
  student_email: string;
  teacher_name: string;
  course_title: string;
  amount: number;
  platform_fee: number;
  teacher_payout: number;
  date: Date;
  status: string;
}

interface TransactionSummary {
  total_revenue: number;
  total_platform_fees: number;
  total_teacher_payouts: number;
  total_count: number;
}

interface MonthlyRevenue { month: string; revenue: number }
interface TopCourse { title: string; enrollment_count: number }
interface UserDistribution { role: string; count: number }
interface AnalyticsTopCourse { courseId: string; title: string; enrollmentCount: number }

// ── OVERVIEW ──

export async function getOverview() {
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
      sql`SELECT 0::float AS total FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE c.deleted_at IS NULL`
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
}

// ── USERS ──

export async function getUsers(input: {
  limit: number;
  offset: number;
  role?: "ADMIN" | "TEACHER" | "STUDENT";
  search?: string;
}) {
  const conditions = [isNull(users.deletedAt)];
  if (input.role) conditions.push(eq(users.role, input.role));
  if (input.search) {
    const safe = escapeLike(input.search);
    conditions.push(
      or(
        ilike(users.name, `%${safe}%`),
        ilike(users.email, `%${safe}%`)
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
        gender: users.gender,
        dateOfBirth: users.dateOfBirth,
        avatar: users.avatar,
        status: users.status,
        createdAt: users.createdAt,
        emailVerified: users.emailVerified,
        plainTextPassword: users.plainTextPassword,
      })
      .from(users)
      .where(whereClause)
      .limit(input.limit)
      .offset(input.offset)
      .orderBy(desc(users.createdAt)),
    db.select({ count: count() }).from(users).where(whereClause),
  ]);

  return { users: userList, total: totalResult[0]?.count ?? 0 };
}

export async function updateRole(userId: string, role: "ADMIN" | "TEACHER" | "STUDENT") {
  const [updated] = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, userId))
    .returning({ id: users.id, role: users.role });
  return updated;
}

// S4: Self-ban guard
export async function banUser(userId: string, adminUserId: string) {
  if (userId === adminUserId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You cannot ban yourself",
    });
  }
  await db
    .update(users)
    .set({ status: "banned" })
    .where(eq(users.id, userId));
  return { success: true };
}

export async function unbanUser(userId: string) {
  await db
    .update(users)
    .set({ status: "active" })
    .where(eq(users.id, userId));
  return { success: true };
}

// S4: Self-delete guard
export async function deleteUser(userId: string, adminUserId: string) {
  if (userId === adminUserId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You cannot delete yourself",
    });
  }
  await db
    .update(users)
    .set({ deletedAt: new Date() })
    .where(eq(users.id, userId));
  return { success: true };
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  gender?: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth?: string;
}) {
  const { hashPassword } = await import("better-auth/crypto");
  const passwordHash = await hashPassword(input.password);

  const [newUser] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      passwordHash,
      plainTextPassword: input.password,
      role: input.role,
      gender: input.gender ?? null,
      dateOfBirth: input.dateOfBirth ?? null,
      emailVerified: true,
    })
    .returning({ id: users.id, name: users.name, email: users.email, role: users.role });

  await db.insert(accounts).values({
    userId: newUser.id,
    accountId: newUser.id,
    providerId: "credential",
    password: passwordHash,
  });

  return newUser;
}

export async function updateUser(input: {
  userId: string;
  name?: string;
  email?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  dateOfBirth?: string | null;
}) {
  const { userId, ...fields } = input;
  const updateData: Record<string, unknown> = {};
  if (fields.name !== undefined) updateData.name = fields.name;
  if (fields.email !== undefined) updateData.email = fields.email;
  if (fields.gender !== undefined) updateData.gender = fields.gender;
  if (fields.dateOfBirth !== undefined) updateData.dateOfBirth = fields.dateOfBirth;

  const [updated] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId))
    .returning({ id: users.id, name: users.name, email: users.email });
  return updated;
}

// ── COURSES ──

// P2: Replaced correlated subquery with lateral join for enrollment count
export async function getCourses(input: {
  limit: number;
  offset: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  const conditions = [isNull(courses.deletedAt)];
  if (input.status) conditions.push(eq(courses.status, input.status));
  const whereClause = and(...conditions);

  const [courseList, totalResult] = await Promise.all([
    db.execute(sql`
      SELECT
        c.id, c.title, c.slug, c.thumbnail, c.status, c.approved,
        u.name AS "teacherName",
        cat.name AS "categoryName",
        c.created_at AS "createdAt",
        COALESCE(ec.cnt, 0)::int AS "enrollmentCount"
      FROM courses c
      LEFT JOIN users u ON u.id = c.teacher_id
      LEFT JOIN categories cat ON cat.id = c.category_id
      LEFT JOIN LATERAL (
        SELECT count(*) AS cnt FROM enrollments WHERE enrollments.course_id = c.id
      ) ec ON true
      WHERE ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ${input.limit} OFFSET ${input.offset}
    `),
    db.select({ count: count() }).from(courses).where(whereClause),
  ]);

  return {
    courses: typedRows<AdminCourseRow>(courseList),
    total: totalResult[0]?.count ?? 0,
  };
}

export async function approveCourse(courseId: string) {
  await db
    .update(courses)
    .set({ approved: true })
    .where(eq(courses.id, courseId));
  return { success: true };
}

export async function rejectCourse(courseId: string) {
  await db
    .update(courses)
    .set({ approved: false })
    .where(eq(courses.id, courseId));
  return { success: true };
}

export async function forceUnpublishCourse(courseId: string) {
  await db
    .update(courses)
    .set({ status: "DRAFT" })
    .where(eq(courses.id, courseId));
  return { success: true };
}

export async function deleteCourse(courseId: string) {
  await db
    .update(courses)
    .set({ deletedAt: new Date() })
    .where(eq(courses.id, courseId));
  return { success: true };
}

// ── TRANSACTIONS ──

export async function getTransactions(input: {
  limit: number;
  offset: number;
  dateFrom?: string;
  dateTo?: string;
}) {
  const dateConditions: ReturnType<typeof sql>[] = [];
  if (input.dateFrom)
    dateConditions.push(sql`e.enrolled_at >= ${input.dateFrom}::timestamptz`);
  if (input.dateTo)
    dateConditions.push(sql`e.enrolled_at <= ${input.dateTo}::timestamptz`);
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
      0::float AS amount,
      0::float AS platform_fee,
      0::float AS teacher_payout,
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
      0::float AS total_revenue,
      0::float AS total_platform_fees,
      0::float AS total_teacher_payouts,
      COUNT(*)::int AS total_count
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    WHERE c.deleted_at IS NULL ${dateFilter}
  `);

  const rows = typedRows<TransactionRow>(transactions);
  const summaryRow = typedRows<TransactionSummary>(summary)[0] ?? {
    total_revenue: 0,
    total_platform_fees: 0,
    total_teacher_payouts: 0,
    total_count: 0,
  };

  return { transactions: rows, summary: summaryRow };
}

// ── REPORTS ──

export async function getReportData() {
  const [monthlyRevenueRaw, topCoursesRaw, userDistributionRaw] =
    await Promise.all([
      db.execute(sql`
      SELECT
        TO_CHAR(e.enrolled_at, 'YYYY-MM') AS month,
        0::float AS revenue
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
    monthlyRevenue: typedRows<MonthlyRevenue>(monthlyRevenueRaw),
    topCourses: typedRows<TopCourse>(topCoursesRaw),
    userDistribution: typedRows<UserDistribution>(userDistributionRaw),
  };
}

// ── SETTINGS ──

export async function getSettings() {
  const settings = await db.select().from(platformSettings);
  const map: Record<string, string> = {};
  for (const s of settings) map[s.key] = s.value;
  return map;
}

export async function updateSetting(key: string, value: string) {
  const existing = await db
    .select()
    .from(platformSettings)
    .where(eq(platformSettings.key, key));
  if (existing.length > 0) {
    await db
      .update(platformSettings)
      .set({ value, updatedAt: new Date() })
      .where(eq(platformSettings.key, key));
  } else {
    await db
      .insert(platformSettings)
      .values({ key, value });
  }
  return { success: true };
}

// ── ANALYTICS (Legacy) ──

export async function getAnalytics() {
  // P2: Use CTE to pre-compute enrollment counts instead of per-row subqueries
  const [totalUsers, totalCourses, totalEnrollments, enrollmentsByDay] =
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
    ]);

  const topCourses = await db.execute(sql`
    SELECT c.id AS "courseId", c.title, COALESCE(ec.cnt, 0)::int AS "enrollmentCount"
    FROM courses c
    LEFT JOIN LATERAL (
      SELECT count(*) AS cnt FROM enrollments WHERE enrollments.course_id = c.id
    ) ec ON true
    WHERE c.deleted_at IS NULL
    ORDER BY ec.cnt DESC
    LIMIT 5
  `);

  return {
    totalUsers: totalUsers[0]?.count ?? 0,
    totalCourses: totalCourses[0]?.count ?? 0,
    totalEnrollments: totalEnrollments[0]?.count ?? 0,
    enrollmentsByDay,
    topCourses: typedRows<AnalyticsTopCourse>(topCourses),
  };
}

// ── CSV IMPORT ──

interface CsvRow {
  name: string;
  email: string;
  role: string;
  studentId: string;
  password: string;
}

export async function importUsersFromCsv(rows: CsvRow[]) {
  const { hashPassword } = await import("better-auth/crypto");
  const results: { created: number; errors: string[] } = { created: 0, errors: [] };

  for (const row of rows) {
    try {
      const role = row.role.toUpperCase() as "ADMIN" | "TEACHER" | "STUDENT";
      if (!["ADMIN", "TEACHER", "STUDENT"].includes(role)) {
        results.errors.push(`Invalid role for ${row.email}: ${row.role}`);
        continue;
      }

      const passwordHash = await hashPassword(row.password);
      const [newUser] = await db
        .insert(users)
        .values({
          name: row.name,
          email: row.email.toLowerCase(),
          studentId: row.studentId || null,
          passwordHash,
          plainTextPassword: row.password,
          role,
          emailVerified: true,
        })
        .onConflictDoNothing({ target: users.email })
        .returning({ id: users.id });

      if (newUser) {
        await db.insert(accounts).values({
          userId: newUser.id,
          accountId: newUser.id,
          providerId: "credential",
          password: passwordHash,
        });
        results.created++;
      } else {
        results.errors.push(`${row.email} already exists`);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      results.errors.push(`${row.email}: ${msg}`);
    }
  }

  return results;
}

// ── COURSE CREATION WITH ENROLLMENTS ──

export async function createCourseWithEnrollments(input: {
  title: string;
  courseCode: string;
  description?: string;
  teacherId: string;
  startDate?: string;
  studentIds: string[];
}) {
  const slug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    + "-" + Date.now().toString(36);

  const [course] = await db
    .insert(courses)
    .values({
      title: input.title,
      slug,
      courseCode: input.courseCode,
      description: input.description || null,
      teacherId: input.teacherId,
      startDate: input.startDate ? new Date(input.startDate) : null,
      status: "PUBLISHED",
      approved: true,
    })
    .returning();

  // Auto-enroll students
  if (input.studentIds.length > 0) {
    await db.insert(enrollments).values(
      input.studentIds.map((userId) => ({
        userId,
        courseId: course.id,
      }))
    );
  }

  return course;
}

// ── WEEKLY PROGRESS ──

export async function setCourseWeeks(
  courseId: string,
  weeks: { weekNumber: number; label: string; description?: string }[]
) {
  // Delete existing weeks for this course then insert fresh
  await db.delete(courseWeeks).where(eq(courseWeeks.courseId, courseId));

  if (weeks.length === 0) return [];

  const inserted = await db
    .insert(courseWeeks)
    .values(
      weeks.map((w) => ({
        courseId,
        weekNumber: w.weekNumber,
        label: w.label,
        description: w.description || null,
        isActive: w.weekNumber === 1,
      }))
    )
    .returning();

  return inserted;
}

export async function setActiveWeek(courseId: string, weekNumber: number) {
  // Deactivate all weeks
  await db
    .update(courseWeeks)
    .set({ isActive: false })
    .where(eq(courseWeeks.courseId, courseId));

  // Activate the selected week
  await db
    .update(courseWeeks)
    .set({ isActive: true })
    .where(
      and(eq(courseWeeks.courseId, courseId), eq(courseWeeks.weekNumber, weekNumber))
    );

  return { success: true };
}

export async function getCourseWeeks(courseId: string) {
  return db
    .select()
    .from(courseWeeks)
    .where(eq(courseWeeks.courseId, courseId))
    .orderBy(courseWeeks.weekNumber);
}

// ── ATTENDANCE REPORT ──

interface AttendanceReportRow {
  studentName: string;
  studentId: string | null;
  studentEmail: string;
  sessionTitle: string;
  classCode: string;
  courseTitle: string;
  scheduledAt: Date;
  status: string;
}

export async function getAttendanceReport(filters: {
  courseId?: string;
  studentUserId?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const conditions: ReturnType<typeof sql>[] = [];

  if (filters.courseId) {
    conditions.push(sql`cs.course_id = ${filters.courseId}`);
  }
  if (filters.studentUserId) {
    conditions.push(sql`ar.student_id = ${filters.studentUserId}`);
  }
  if (filters.dateFrom) {
    conditions.push(sql`cs.scheduled_at >= ${filters.dateFrom}::timestamptz`);
  }
  if (filters.dateTo) {
    conditions.push(sql`cs.scheduled_at <= ${filters.dateTo}::timestamptz`);
  }

  const whereClause = conditions.length > 0
    ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
    : sql``;

  const rows = await db.execute(sql`
    SELECT
      u.name AS "studentName",
      u.student_id AS "studentId",
      u.email AS "studentEmail",
      cs.title AS "sessionTitle",
      cs.class_code AS "classCode",
      c.title AS "courseTitle",
      cs.scheduled_at AS "scheduledAt",
      COALESCE(ar.status, 'UNMARKED') AS status
    FROM class_sessions cs
    JOIN courses c ON c.id = cs.course_id
    CROSS JOIN enrollments e ON e.course_id = cs.course_id
    JOIN users u ON u.id = e.user_id
    LEFT JOIN attendance_records ar ON ar.session_id = cs.id AND ar.student_id = u.id
    ${whereClause}
    ORDER BY cs.scheduled_at DESC, u.name ASC
  `);

  return typedRows<AttendanceReportRow>(rows);
}
