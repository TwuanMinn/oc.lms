import { z } from "zod";
import { router, adminProcedure } from "@/server/trpc";
import * as adminService from "@/server/services/admin.service";

// A1: Thin router — all business logic lives in admin.service.ts
export const adminRouter = router({
  getOverview: adminProcedure.query(async () => {
    return adminService.getOverview();
  }),

  getUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(500).default(20),
        offset: z.number().min(0).default(0),
        role: z.enum(["ADMIN", "TEACHER", "STUDENT"]).optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return adminService.getUsers(input);
    }),

  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        role: z.enum(["ADMIN", "TEACHER", "STUDENT"]),
      })
    )
    .mutation(async ({ input }) => {
      return adminService.updateRole(input.userId, input.role);
    }),

  // S4: Pass admin's own ID for self-ban guard
  banUser: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      return adminService.banUser(input.userId, ctx.user.id);
    }),

  unbanUser: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return adminService.unbanUser(input.userId);
    }),

  // S4: Pass admin's own ID for self-delete guard
  deleteUser: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      return adminService.deleteUser(input.userId, ctx.user.id);
    }),

  createUser: adminProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters").default("Admin123!"),
        role: z.enum(["ADMIN", "TEACHER", "STUDENT"]).default("STUDENT"),
        gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
        dateOfBirth: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return adminService.createUser(input);
    }),

  updateUser: adminProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
        gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable().optional(),
        dateOfBirth: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return adminService.updateUser(input);
    }),

  getCourses: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
      })
    )
    .query(async ({ input }) => {
      return adminService.getCourses(input);
    }),

  approveCourse: adminProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return adminService.approveCourse(input.courseId);
    }),

  rejectCourse: adminProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return adminService.rejectCourse(input.courseId);
    }),

  forceUnpublishCourse: adminProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return adminService.forceUnpublishCourse(input.courseId);
    }),

  deleteCourse: adminProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return adminService.deleteCourse(input.courseId);
    }),

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
      return adminService.getTransactions(input);
    }),

  getReportData: adminProcedure.query(async () => {
    return adminService.getReportData();
  }),

  getSettings: adminProcedure.query(async () => {
    return adminService.getSettings();
  }),

  // #3: Restrict to known setting keys — prevents injection of arbitrary keys
  updateSetting: adminProcedure
    .input(z.object({
      key: z.enum([
        "platform_name",
        "platform_fee",
        "maintenance_mode",
        "enrollment_enabled",
        "max_enrollments_per_course",
        "default_currency",
        "support_email",
        "terms_url",
        "privacy_url",
      ]),
      value: z.string(),
    }))
    .mutation(async ({ input }) => {
      return adminService.updateSetting(input.key, input.value);
    }),

  getAnalytics: adminProcedure.query(async () => {
    return adminService.getAnalytics();
  }),

  // ── CSV Import ──
  importCsv: adminProcedure
    .input(z.object({
      rows: z.array(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        role: z.string().min(1),
        studentId: z.string(),
        password: z.string().min(1),
      })),
    }))
    .mutation(async ({ input }) => {
      return adminService.importUsersFromCsv(input.rows);
    }),

  // ── Course creation with enrollments ──
  createCourseWithEnrollments: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      courseCode: z.string().min(1),
      description: z.string().optional(),
      teacherId: z.string().uuid(),
      startDate: z.string().optional(),
      studentIds: z.array(z.string().uuid()),
    }))
    .mutation(async ({ input }) => {
      return adminService.createCourseWithEnrollments(input);
    }),

  // ── Weekly Progress ──
  setCourseWeeks: adminProcedure
    .input(z.object({
      courseId: z.string().uuid(),
      weeks: z.array(z.object({
        weekNumber: z.number().min(1),
        label: z.string().min(1),
        description: z.string().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      return adminService.setCourseWeeks(input.courseId, input.weeks);
    }),

  setActiveWeek: adminProcedure
    .input(z.object({
      courseId: z.string().uuid(),
      weekNumber: z.number().min(1),
    }))
    .mutation(async ({ input }) => {
      return adminService.setActiveWeek(input.courseId, input.weekNumber);
    }),

  getCourseWeeks: adminProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .query(async ({ input }) => {
      return adminService.getCourseWeeks(input.courseId);
    }),

  // ── Attendance Report ──
  getAttendanceReport: adminProcedure
    .input(z.object({
      courseId: z.string().uuid().optional(),
      studentUserId: z.string().uuid().optional(),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return adminService.getAttendanceReport(input);
    }),
});
