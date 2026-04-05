// Migration:
// CREATE TABLE IF NOT EXISTS platform_settings (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   key TEXT NOT NULL UNIQUE,
//   value TEXT NOT NULL,
//   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );

import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const platformSettings = pgTable(
  "platform_settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull().unique(),
    value: text("value").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_platform_settings_key").on(table.key)]
);

export type PlatformSetting = typeof platformSettings.$inferSelect;
