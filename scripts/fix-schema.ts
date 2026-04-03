import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const c = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(c);

async function fixSchema() {
  console.log("🔧 Adding missing columns to sessions table...\n");

  // Add ipAddress and userAgent columns that Better Auth expects
  await db.execute(sql`
    ALTER TABLE sessions 
    ADD COLUMN IF NOT EXISTS ip_address TEXT,
    ADD COLUMN IF NOT EXISTS user_agent TEXT
  `);
  console.log("   ✅ Added ip_address and user_agent to sessions\n");

  // Verify
  const cols = await db.execute(sql`
    SELECT column_name FROM information_schema.columns 
    WHERE table_name = 'sessions' AND table_schema = 'public'
    ORDER BY ordinal_position
  `);
  console.log("   Sessions columns now:");
  for (const col of cols) {
    console.log(`     - ${(col as any).column_name}`);
  }

  await c.end();
  console.log("\n🎉 Schema fixed!");
}

fixSchema().catch(console.error);
