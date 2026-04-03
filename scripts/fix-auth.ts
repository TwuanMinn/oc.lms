import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as usersSchema from "../server/db/schema/users";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

async function fixAuth() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL not set");
    process.exit(1);
  }

  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client, { schema: { ...usersSchema } });

  console.log("🔧 Fixing auth accounts...\n");

  const passwordHash = await hash("Admin123!", 10);

  // Get all existing users
  const existingUsers = await db
    .select({ id: usersSchema.users.id, email: usersSchema.users.email })
    .from(usersSchema.users);

  console.log(`Found ${existingUsers.length} users`);

  for (const user of existingUsers) {
    // Check if account already exists
    const existing = await db
      .select()
      .from(usersSchema.accounts)
      .where(eq(usersSchema.accounts.userId, user.id));

    if (existing.length === 0) {
      await db.insert(usersSchema.accounts).values({
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: passwordHash,
      });
      console.log(`  ✅ Created account for ${user.email}`);
    } else {
      // Update the password in existing account
      await db
        .update(usersSchema.accounts)
        .set({ password: passwordHash })
        .where(eq(usersSchema.accounts.userId, user.id));
      console.log(`  🔄 Updated password for ${user.email}`);
    }
  }

  await client.end();
  console.log("\n🎉 Auth accounts fixed!");
}

fixAuth().catch(console.error);
