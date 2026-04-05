import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client);

const THUMB_MAP: Record<string, string> = {
  "web-development": "/images/courses/web-development.png",
  "data-science": "/images/courses/data-science.png",
  "mobile-development": "/images/courses/mobile-development.png",
  "cloud-devops": "/images/courses/cloud-devops.png",
  "cybersecurity": "/images/courses/cybersecurity.png",
};

async function seed() {
  console.log("🖼️  Assigning thumbnails...");
  for (const [catSlug, thumb] of Object.entries(THUMB_MAP)) {
    const res = await db.execute(
      sql`UPDATE courses SET thumbnail = ${thumb} FROM categories WHERE courses.category_id = categories.id AND categories.slug = ${catSlug} AND (courses.thumbnail IS NULL OR courses.thumbnail = '')`
    );
    console.log(`   ✅ ${catSlug} → ${thumb}`);
  }

  // Get all users and courses
  const students = await db.execute(sql`SELECT id FROM users WHERE role = 'STUDENT'`);
  const allUsers = await db.execute(sql`SELECT id FROM users`);
  const courses = await db.execute(sql`SELECT id, slug FROM courses WHERE status = 'PUBLISHED'`);

  if (courses.length === 0) { console.log("No courses found"); await client.end(); return; }

  // Seed enrollments
  console.log("\n📊 Seeding enrollments...");
  const usersToEnroll = allUsers.length > 0 ? allUsers : students;
  let enrollCount = 0;
  for (const course of courses) {
    const numEnroll = 3 + Math.floor(Math.random() * 5); // 3-7 per course
    for (let i = 0; i < Math.min(numEnroll, usersToEnroll.length); i++) {
      const userId = (usersToEnroll[i] as any).id;
      const courseId = (course as any).id;
      try {
        await db.execute(
          sql`INSERT INTO enrollments (user_id, course_id) VALUES (${userId}, ${courseId}) ON CONFLICT DO NOTHING`
        );
        enrollCount++;
      } catch { /* skip duplicates */ }
    }
  }
  console.log(`   ✅ Created ${enrollCount} enrollments`);

  // Seed reviews
  console.log("\n⭐ Seeding reviews...");
  const reviewBodies = [
    "Excellent course! The explanations are clear and the examples are practical.",
    "Very well structured content. I learned so much in just a few hours.",
    "The instructor knows the subject deeply. Highly recommended for beginners.",
    "Great balance between theory and hands-on practice. Worth every penny.",
    "One of the best courses I've taken. The code examples are production-quality.",
    "Clear, concise, and up-to-date. Exactly what I needed for my career.",
    "Loved the project-based approach. I built something real by the end.",
    "The curriculum is well-thought-out and progressively builds complexity.",
  ];
  let reviewCount = 0;
  for (const course of courses) {
    const numReviews = 2 + Math.floor(Math.random() * 3); // 2-4 per course
    for (let i = 0; i < Math.min(numReviews, usersToEnroll.length); i++) {
      const userId = (usersToEnroll[i] as any).id;
      const courseId = (course as any).id;
      const rating = 4 + Math.floor(Math.random() * 2); // 4 or 5
      const body = reviewBodies[Math.floor(Math.random() * reviewBodies.length)];
      try {
        await db.execute(
          sql`INSERT INTO reviews (user_id, course_id, rating, body) VALUES (${userId}, ${courseId}, ${rating}, ${body}) ON CONFLICT DO NOTHING`
        );
        reviewCount++;
      } catch { /* skip duplicates */ }
    }
  }
  console.log(`   ✅ Created ${reviewCount} reviews`);

  await client.end();
  console.log("\n🎉 Social proof seeded!");
}

seed().catch((e) => { console.error("❌", e); process.exit(1); });
