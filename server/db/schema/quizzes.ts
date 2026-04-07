import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { lessons } from "./courses";

export const questionTypeEnum = pgEnum("question_type", ["MCQ", "MULTI"]);

export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" })
    .unique(),
  title: text("title").notNull(),
  instructions: text("instructions"),
  passingScore: integer("passing_score").notNull().default(70),
  timeLimitMinutes: integer("time_limit_minutes"),
  // Teacher schedules when the test opens/closes
  availableFrom: timestamp("available_from", { withTimezone: true }),
  availableUntil: timestamp("available_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  type: questionTypeEnum("type").notNull().default("MCQ"),
  options: jsonb("options").notNull().$type<
    Array<{ id: string; text: string }>
  >(),
  correctOptions: jsonb("correct_options").notNull().$type<string[]>(),
  position: integer("position").notNull().default(0),
});

// Enforce single attempt per student per quiz
export const quizAttempts = pgTable(
  "quiz_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    answers: jsonb("answers").notNull().$type<
      Array<{ questionId: string; selectedOptions: string[] }>
    >(),
    score: integer("score").notNull(),
    passed: boolean("passed").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_quiz_attempt").on(table.userId, table.quizId),
  ]
);

export type Quiz = typeof quizzes.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
