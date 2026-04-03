import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL not set");
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

async function check() {
  const courses = await db.execute(sql`SELECT id, title, status FROM courses`);
  const users = await db.execute(sql`SELECT id, name, role FROM users LIMIT 5`);
  const modules = await db.execute(sql`SELECT id, title FROM modules`);
  const lessons = await db.execute(sql`SELECT id, title FROM lessons`);

  console.log(`\n📊 Database Status:`);
  console.log(`  Users:   ${users.length}`);
  console.log(`  Courses: ${courses.length}`);
  console.log(`  Modules: ${modules.length}`);
  console.log(`  Lessons: ${lessons.length}`);

  if (courses.length > 0) {
    console.log(`\n📚 Courses:`);
    courses.forEach((c: any) => console.log(`  - ${c.title} (${c.status})`));
  }

  await client.end();
}

check().catch(console.error);
