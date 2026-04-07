import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../server/db/schema/users";
import { isNull, eq } from "drizzle-orm";

const FEMALE_PATTERNS = [
  "thi", "nhi", "linh", "hoa", "lan", "mai", "yen", "xuan",
  "huong", "phuong", "ngoc", "ha", "anh", "yating", "yiwen",
  "fang", "mei", "ying", "xiu", "hua", "zixuan", "zhao",
  "song", "xiaoling", "ling", "jing", "rong", "yan",
];

function guessGender(name: string, index: number): "MALE" | "FEMALE" {
  const lower = name.toLowerCase();
  const isFemale = FEMALE_PATTERNS.some((p) => lower.includes(p));
  if (isFemale) return "FEMALE";
  // Alternate for unknown names to keep a ~50/50 mix
  return index % 2 === 0 ? "MALE" : "FEMALE";
}

async function run() {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false });
  const db = drizzle(client, { schema });

  const users = await db
    .select({ id: schema.users.id, name: schema.users.name })
    .from(schema.users)
    .where(isNull(schema.users.deletedAt));

  console.log(`Assigning gender to ${users.length} users...`);

  for (let i = 0; i < users.length; i++) {
    const { id, name } = users[i];
    const gender = guessGender(name, i);
    await db.update(schema.users).set({ gender }).where(eq(schema.users.id, id));
    console.log(`  ${name.padEnd(25)} → ${gender}`);
  }

  console.log("\n✅ All users have been assigned a gender!");
  await client.end();
}

run().catch(console.error);
