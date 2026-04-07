import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

async function main() {
  console.log("Starting cleanup...");
  
  // Update deleted_at for all courses EXCEPT the one you want to keep
  // Looking for "Language model LLM" or similar
  const keepTitle = '%llm%';
  
  const result = await db.execute(sql`
    UPDATE courses 
    SET deleted_at = NOW() 
    WHERE title NOT ILIKE ${keepTitle}
      AND deleted_at IS NULL
    RETURNING id, title;
  `);

  console.log(`Soft deleted ${result.length} old courses.`);
  for (const r of result) {
    console.log(`- Deleted: ${r.title}`);
  }

  await client.end();
}

main().catch(console.error);
