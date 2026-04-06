import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as users from "./schema/users";
import * as courses from "./schema/courses";
import * as learning from "./schema/learning";
import * as quizzes from "./schema/quizzes";
import * as social from "./schema/social";
import * as billing from "./schema/billing";
import * as platform from "./schema/platform";

// P3: Connection pool configuration
const client = postgres(env.DATABASE_URL, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, {
  schema: { ...users, ...courses, ...learning, ...quizzes, ...social, ...billing, ...platform },
});

export type DB = typeof db;
