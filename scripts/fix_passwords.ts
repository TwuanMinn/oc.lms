import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const client = postgres(
  "postgresql://postgres:LMSdev2026!!!@db.cngwpntklbfpbqyxtox.supabase.co:5432/postgres"
);
const db = drizzle(client);

const result = await db.execute(
  sql`UPDATE users SET plain_text_password = 'Admin123!' WHERE deleted_at IS NULL`
);
console.log("✅ Done! Rows updated:", result.length ?? result.count ?? "OK");
await client.end();
