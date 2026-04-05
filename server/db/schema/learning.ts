import {
  pgTable,
  uuid,
  text,
  timestamp,
  unique,
  index,
  integer,
  date,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { courses } from "./courses";
import { lessons } from "./courses";

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique("uq_enrollment").on(table.userId, table.courseId),
    index("idx_enrollments_user").on(table.userId),
    index("idx_enrollments_course").on(table.courseId),
  ]
);

export const progress = pgTable(
  "progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_progress").on(table.userId, table.lessonId),
    index("idx_progress_user_course").on(table.userId, table.courseId),
  ]
);

export const certificates = pgTable(
  "certificates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    certificateNumber: text("certificate_number").notNull().unique(),
    issuedAt: timestamp("issued_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_certificate").on(table.userId, table.courseId),
    index("idx_certificates_user").on(table.userId),
  ]
);

export const learningStreaks = pgTable(
  "learning_streaks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    activityDate: date("activity_date").notNull(),
    lessonsCompleted: integer("lessons_completed").notNull().default(1),
  },
  (table) => [
    unique("uq_streak_day").on(table.userId, table.activityDate),
    index("idx_streaks_user").on(table.userId),
  ]
);

export type Enrollment = typeof enrollments.$inferSelect;
export type Progress = typeof progress.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type LearningStreak = typeof learningStreaks.$inferSelect;
