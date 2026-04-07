import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "./server/db/schema/users";
import { isNull, sql } from "drizzle-orm";

function randomDOB(minAge: number, maxAge: number): string {
  const now = new Date();
  const minYear = now.getFullYear() - maxAge;
  const maxYear = now.getFullYear() - minAge;
  const year = minYear + Math.floor(Math.random() * (maxYear - minYear + 1));
  const month = 1 + Math.floor(Math.random() * 12);
  const day = 1 + Math.floor(Math.random() * 28);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL!;
  const client = postgres(DATABASE_URL, { ssl: "require", prepare: false });
  const db = drizzle(client);

  const result = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(isNull(users.dateOfBirth));

  console.log(`Found ${result.length} users without DOB. Filling...`);

  for (const user of result) {
    const ranges: Record<string, [number, number]> = {
      STUDENT: [17, 25],
      TEACHER: [25, 45],
      ADMIN: [30, 50],
    };
    const [min, max] = ranges[user.role] ?? [18, 40];
    const dob = randomDOB(min, max);

    await db
      .update(users)
      .set({ dateOfBirth: dob })
      .where(sql`${users.id} = ${user.id}`);

    console.log(`  ✓ ${user.role} → ${dob}`);
  }

  console.log("✅ Done!");
  await client.end();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
