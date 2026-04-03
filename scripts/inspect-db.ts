import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import { writeFileSync } from "fs";

const c = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(c);

async function main() {
  let output = "";
  const log = (msg: string) => { output += msg + "\n"; };

  const userCols = await db.execute(sql`
    SELECT column_name, data_type FROM information_schema.columns 
    WHERE table_name = 'users' AND table_schema = 'public'
    ORDER BY ordinal_position
  `);
  log("USERS COLUMNS:");
  for (const col of userCols) log(`  ${(col as any).column_name} (${(col as any).data_type})`);

  const accountCols = await db.execute(sql`
    SELECT column_name, data_type FROM information_schema.columns 
    WHERE table_name = 'accounts' AND table_schema = 'public'
    ORDER BY ordinal_position
  `);
  log("\nACCOUNTS COLUMNS:");
  for (const col of accountCols) log(`  ${(col as any).column_name} (${(col as any).data_type})`);

  const sessionCols = await db.execute(sql`
    SELECT column_name, data_type FROM information_schema.columns 
    WHERE table_name = 'sessions' AND table_schema = 'public'
    ORDER BY ordinal_position
  `);
  log("\nSESSIONS COLUMNS:");
  for (const col of sessionCols) log(`  ${(col as any).column_name} (${(col as any).data_type})`);

  const users = await db.execute(sql`SELECT id, email, role, email_verified FROM users`);
  log("\nUSERS DATA:");
  for (const u of users) log(`  ${(u as any).email} | role=${(u as any).role} | verified=${(u as any).email_verified}`);

  const accounts = await db.execute(sql`
    SELECT a.user_id, a.provider_id, LENGTH(a.password) as pw_len, u.email
    FROM accounts a JOIN users u ON u.id = a.user_id
  `);
  log("\nACCOUNTS DATA:");
  for (const a of accounts) log(`  ${(a as any).email} | provider=${(a as any).provider_id} | pw_len=${(a as any).pw_len}`);

  writeFileSync("db-inspect-output.txt", output);
  console.log("Written to db-inspect-output.txt");
  await c.end();
}

main().catch(console.error);
