/**
 * Fix auth accounts by seeding them with Better Auth's own password hashing.
 *
 * Root cause: The old seed script used bcryptjs to hash passwords, but
 * Better Auth uses scrypt internally. This mismatch caused "Invalid credentials".
 */
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

// Import Better Auth's own hashPassword so the format matches exactly
import { hashPassword } from "better-auth/crypto";

interface AccountDef {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
}

const TEST_ACCOUNTS: AccountDef[] = [
  { name: "Admin User", email: "admin@lms.dev", password: "Admin123!", role: "ADMIN" },
  { name: "Jane Teacher", email: "teacher@lms.dev", password: "Admin123!", role: "TEACHER" },
  { name: "Alex Student", email: "student@lms.dev", password: "Admin123!", role: "STUDENT" },
];

async function fixAuthAccounts() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL not set");
    process.exit(1);
  }

  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client);

  console.log("🔧 Fixing auth accounts with Better Auth's native hashing...\n");

  // Hash the password using Better Auth's own scrypt implementation
  const hashedPassword = await hashPassword("Admin123!");
  console.log(`   🔐 Password hashed (scrypt, len=${hashedPassword.length})\n`);

  for (const acct of TEST_ACCOUNTS) {
    // Upsert user
    const existingUser = await db.execute(
      sql`SELECT id FROM users WHERE email = ${acct.email}`
    );

    let userId: string;

    if (existingUser.length > 0) {
      userId = (existingUser[0] as any).id;
      // Update role and password_hash
      await db.execute(
        sql`UPDATE users SET name = ${acct.name}, role = ${acct.role}, email_verified = true, password_hash = ${hashedPassword} WHERE id = ${userId}`
      );
      console.log(`   🔄 Updated user: ${acct.email}`);
    } else {
      const inserted = await db.execute(
        sql`INSERT INTO users (email, name, password_hash, role, email_verified) VALUES (${acct.email}, ${acct.name}, ${hashedPassword}, ${acct.role}, true) RETURNING id`
      );
      userId = (inserted[0] as any).id;
      console.log(`   ✅ Created user: ${acct.email}`);
    }

    // Upsert account (Better Auth stores password here for credential provider)
    const existingAccount = await db.execute(
      sql`SELECT id FROM accounts WHERE user_id = ${userId} AND provider_id = 'credential'`
    );

    if (existingAccount.length > 0) {
      await db.execute(
        sql`UPDATE accounts SET password = ${hashedPassword} WHERE user_id = ${userId} AND provider_id = 'credential'`
      );
      console.log(`   🔄 Updated account credentials for: ${acct.email}`);
    } else {
      await db.execute(
        sql`INSERT INTO accounts (user_id, account_id, provider_id, password) VALUES (${userId}, ${userId}, 'credential', ${hashedPassword})`
      );
      console.log(`   ✅ Created account credentials for: ${acct.email}`);
    }
  }

  await client.end();
  console.log("\n🎉 Auth accounts fixed! You can now log in with:");
  console.log("   📧 admin@lms.dev     / Admin123!");
  console.log("   📧 teacher@lms.dev   / Admin123!");
  console.log("   📧 student@lms.dev   / Admin123!");
}

fixAuthAccounts().catch(console.error);
