import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as users from "./schema/users";
import * as courses from "./schema/courses";
import * as learning from "./schema/learning";
import * as quizzes from "./schema/quizzes";
import * as social from "./schema/social";
import * as billing from "./schema/billing";

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, {
  schema: { ...users, ...courses, ...learning, ...quizzes, ...social, ...billing },
});

export type DB = typeof db;
