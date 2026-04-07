import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

async function main() {
  // List all courses
  const courses = await db.execute(sql`SELECT id, title, course_code, created_at FROM courses WHERE deleted_at IS NULL ORDER BY created_at`);
  console.log("=== ALL COURSES ===");
  for (const c of courses) {
    console.log(`- ${c.title} (code: ${c.course_code}, id: ${c.id})`);
  }
  console.log(`Total: ${courses.length}`);

  // Check which have sessions
  const withSessions = await db.execute(sql`
    SELECT c.id, c.title, COUNT(cs.id)::int as cnt 
    FROM courses c 
    LEFT JOIN class_sessions cs ON cs.course_id = c.id 
    WHERE c.deleted_at IS NULL 
    GROUP BY c.id, c.title
    ORDER BY cnt DESC
  `);
  console.log("\n=== SESSIONS PER COURSE ===");
  for (const r of withSessions) {
    console.log(`- ${r.title}: ${r.cnt} sessions`);
  }

  // Check which have schedule events
  const withEvents = await db.execute(sql`
    SELECT c.id, c.title, COUNT(se.id)::int as cnt 
    FROM courses c 
    LEFT JOIN schedule_events se ON se.course_id = c.id 
    WHERE c.deleted_at IS NULL 
    GROUP BY c.id, c.title
    ORDER BY cnt DESC
  `);
  console.log("\n=== SCHEDULE EVENTS PER COURSE ===");
  for (const r of withEvents) {
    console.log(`- ${r.title}: ${r.cnt} events`);
  }

  await client.end();
}

main().catch(console.error);
