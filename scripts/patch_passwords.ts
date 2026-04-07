import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as usersSchema from "../server/db/schema/users";
import { isNull } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

async function patch() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL not set in .env");
    process.exit(1);
  }

  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client, { schema: usersSchema });

  const newHash = await hashPassword("Admin123!");

  // Patch ALL active users: set plainTextPassword display + enforce correct hash
  await db
    .update(usersSchema.users)
    .set({
      plainTextPassword: "Admin123!",
      passwordHash: newHash,
    })
    .where(isNull(usersSchema.users.deletedAt));

  console.log("✅ All active users now have password: Admin123!");
  await client.end();
}

patch().catch(console.error);
