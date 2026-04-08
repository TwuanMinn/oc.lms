import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const c = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(c);

// Realistic DOB range: ages 16-45
function randomDOB(): string {
  const now = Date.now();
  const minAge = 16 * 365.25 * 24 * 60 * 60 * 1000;
  const maxAge = 45 * 365.25 * 24 * 60 * 60 * 1000;
  const age = minAge + Math.random() * (maxAge - minAge);
  const dob = new Date(now - age);
  return dob.toISOString().slice(0, 10); // YYYY-MM-DD
}

// Weighted gender assignment (roughly balanced)
function randomGender(): "MALE" | "FEMALE" | "OTHER" {
  const r = Math.random();
  if (r < 0.48) return "MALE";
  if (r < 0.96) return "FEMALE";
  return "OTHER";
}

async function main() {
  // First, check current state
  const users = await db.execute(sql`
    SELECT id, name, email, role, gender, date_of_birth 
    FROM users 
    WHERE deleted_at IS NULL
    ORDER BY created_at
  `);

  console.log(`\nFound ${users.length} users total`);

  const needsGender = users.filter((u: any) => !u.gender);
  const needsDOB = users.filter((u: any) => !u.date_of_birth);

  console.log(`  Missing gender: ${needsGender.length}`);
  console.log(`  Missing DOB:    ${needsDOB.length}`);

  if (needsGender.length === 0 && needsDOB.length === 0) {
    console.log("\n✅ All fields already filled!");
    await c.end();
    return;
  }

  // Fill missing gender and DOB in a single pass
  let updated = 0;
  for (const user of users) {
    const u = user as any;
    const updates: string[] = [];

    if (!u.gender) {
      const gender = randomGender();
      updates.push(`gender = '${gender}'`);
    }
    if (!u.date_of_birth) {
      const dob = randomDOB();
      updates.push(`date_of_birth = '${dob}'`);
    }

    if (updates.length > 0) {
      await db.execute(
        sql.raw(`UPDATE users SET ${updates.join(", ")}, updated_at = NOW() WHERE id = '${u.id}'`)
      );
      updated++;
      console.log(`  ✓ ${u.name} (${u.role}) → ${updates.join(", ")}`);
    }
  }

  console.log(`\n✅ Updated ${updated} users`);

  // Verify
  const verify = await db.execute(sql`
    SELECT 
      COUNT(*) FILTER (WHERE gender IS NULL) as missing_gender,
      COUNT(*) FILTER (WHERE date_of_birth IS NULL) as missing_dob,
      COUNT(*) as total
    FROM users WHERE deleted_at IS NULL
  `);
  const v = verify[0] as any;
  console.log(`\nVerification: ${v.total} users, ${v.missing_gender} missing gender, ${v.missing_dob} missing DOB`);

  await c.end();
}

main().catch(console.error);
