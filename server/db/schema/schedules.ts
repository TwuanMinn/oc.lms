import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { courses, modules } from "./courses";

export const scheduleEventTypeEnum = pgEnum("schedule_event_type", [
  "LIVE_CLASS",
  "ASSIGNMENT",
  "QA_SESSION",
  "MILESTONE",
  "CUSTOM",
]);

export const scheduleEvents = pgTable(
  "schedule_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    moduleId: uuid("module_id").references(() => modules.id, {
      onDelete: "set null",
    }),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    room: text("room"),
    eventType: scheduleEventTypeEnum("event_type")
      .notNull()
      .default("LIVE_CLASS"),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_schedule_events_course").on(table.courseId),
    index("idx_schedule_events_created_by").on(table.createdBy),
    index("idx_schedule_events_start").on(table.startTime),
  ]
);

export type ScheduleEvent = typeof scheduleEvents.$inferSelect;
export type NewScheduleEvent = typeof scheduleEvents.$inferInsert;
