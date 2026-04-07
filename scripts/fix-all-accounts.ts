import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
// We must not import from lib/auth since it's server-only and causes issues in plain scripts.
import { hashPassword } from "better-auth/crypto";

async function fixWithBetterAuthCrypto() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL not set");
    process.exit(1);
  }

  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client);

  console.log("🔧 Fixing ALL auth accounts with better-auth/crypto...\n");

  const hashedPassword = await hashPassword("Admin123!");
  console.log(`🔐 Password hashed with better-auth/crypto (len=${hashedPassword.length})`);

  // Get all users
  const users = await db.execute(sql`SELECT id, email, name FROM users ORDER BY email`);

  for (const user of users) {
    const u = user as any;
    
    await db.execute(
      sql`UPDATE users SET password_hash = ${hashedPassword} WHERE id = ${u.id}`
    );

    // Update account entry
    await db.execute(
      sql`UPDATE accounts SET password = ${hashedPassword} WHERE user_id = ${u.id} AND provider_id = 'credential'`
    );
    console.log(`✅ ${u.email} — updated`);
  }

  await client.end();
  console.log(`\n🎉 Done! All accounts updated with better-auth scrypt.`);
}

fixWithBetterAuthCrypto().catch(console.error);
