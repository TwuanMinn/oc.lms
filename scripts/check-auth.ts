import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client);

async function check() {
  const users = await db.execute(sql`SELECT id, email, name, role, email_verified FROM users ORDER BY email`);
  console.log("\n👤 USERS:");
  for (const u of users) {
    console.log(`  ${u.email} | role=${u.role} | verified=${u.email_verified}`);
  }

  const accounts = await db.execute(sql`
    SELECT a.id, a.user_id, a.provider_id, u.email,
      CASE WHEN a.password IS NOT NULL THEN 'YES' ELSE 'NO' END as has_password,
      LENGTH(a.password) as pw_len
    FROM accounts a
    JOIN users u ON u.id = a.user_id
  `);
  console.log("\n🔑 ACCOUNTS:");
  for (const a of accounts) {
    console.log(`  ${a.email} | provider=${a.provider_id} | has_pw=${a.has_password} | pw_len=${a.pw_len}`);
  }

  await client.end();
}

check().catch(console.error);
