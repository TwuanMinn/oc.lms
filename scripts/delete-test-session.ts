import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { like, eq } from "drizzle-orm";
import { classeSessions } from "../server/db/schema/attendance";

const DATABASE_URL = "postgresql://postgres:LMSdev2026!!!@db.cngwpntklbfpbqyxttox.supabase.co:5432/postgres";
const client = postgres(DATABASE_URL, { prepare: false, ssl: "require" });
const db = drizzle(client);

async function main() {
  const sessions = await db
    .select({ id: classeSessions.id, title: classeSessions.title, classCode: classeSessions.classCode })
    .from(classeSessions)
    .where(like(classeSessions.title, "Class - Apr%"));

  console.log("Found test sessions:", sessions);

  for (const s of sessions) {
    await db.delete(classeSessions).where(eq(classeSessions.id, s.id));
    console.log(`Deleted: ${s.title} (${s.id})`);
  }

  console.log("Done.");
  await client.end();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
