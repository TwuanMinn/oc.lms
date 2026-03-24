import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as usersSchema from "../server/db/schema/users";
import * as coursesSchema from "../server/db/schema/courses";
import * as learningSchema from "../server/db/schema/learning";
import * as quizzesSchema from "../server/db/schema/quizzes";
import { hash } from "bcryptjs";

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL not set in .env.local");
    process.exit(1);
  }

  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client, {
    schema: { ...usersSchema, ...coursesSchema, ...learningSchema, ...quizzesSchema },
  });

  console.log("🌱 Seeding database...\n");

  const passwordHash = await hash("Admin123!", 10);

  // Users
  const [admin] = await db
    .insert(usersSchema.users)
    .values({
      name: "Admin User",
      email: "admin@lms.dev",
      passwordHash,
      role: "ADMIN",
      emailVerified: true,
    })
    .onConflictDoNothing({ target: usersSchema.users.email })
    .returning({ id: usersSchema.users.id });

  const [teacher] = await db
    .insert(usersSchema.users)
    .values({
      name: "Jane Teacher",
      email: "teacher@lms.dev",
      passwordHash,
      role: "TEACHER",
      bio: "Full-stack developer with 10 years of experience.",
      emailVerified: true,
    })
    .onConflictDoNothing({ target: usersSchema.users.email })
    .returning({ id: usersSchema.users.id });

  const [student] = await db
    .insert(usersSchema.users)
    .values({
      name: "Alex Student",
      email: "student@lms.dev",
      passwordHash,
      role: "STUDENT",
      emailVerified: true,
    })
    .onConflictDoNothing({ target: usersSchema.users.email })
    .returning({ id: usersSchema.users.id });

  console.log("✅ Users created");

  // Categories
  const [webCat] = await db
    .insert(coursesSchema.categories)
    .values({ name: "Web Development", slug: "web-development" })
    .onConflictDoNothing({ target: coursesSchema.categories.slug })
    .returning({ id: coursesSchema.categories.id });

  const [dataCat] = await db
    .insert(coursesSchema.categories)
    .values({ name: "Data Science", slug: "data-science" })
    .onConflictDoNothing({ target: coursesSchema.categories.slug })
    .returning({ id: coursesSchema.categories.id });

  console.log("✅ Categories created");

  if (!teacher || !webCat) {
    console.log("⚠️ Skipping courses — data already exists");
    await client.end();
    return;
  }

  // Course
  const [course] = await db
    .insert(coursesSchema.courses)
    .values({
      title: "Complete TypeScript Masterclass",
      slug: "complete-typescript-masterclass",
      description:
        "Master TypeScript from basics to advanced patterns. Learn generics, utility types, decorators, and build production-ready applications.",
      price: "0",
      status: "PUBLISHED",
      teacherId: teacher.id,
      categoryId: webCat.id,
      totalDuration: 120,
    })
    .returning({ id: coursesSchema.courses.id });

  // Modules
  const [mod1] = await db
    .insert(coursesSchema.modules)
    .values({ courseId: course.id, title: "Getting Started", position: 0 })
    .returning({ id: coursesSchema.modules.id });

  const [mod2] = await db
    .insert(coursesSchema.modules)
    .values({ courseId: course.id, title: "Advanced Types", position: 1 })
    .returning({ id: coursesSchema.modules.id });

  // Lessons
  const [lesson1] = await db
    .insert(coursesSchema.lessons)
    .values({
      moduleId: mod1.id,
      courseId: course.id,
      title: "Introduction to TypeScript",
      description: "Why TypeScript? Setting up your environment.",
      content: "# Introduction\n\nTypeScript is a typed superset of JavaScript...",
      duration: 15,
      position: 0,
      isFree: true,
    })
    .returning({ id: coursesSchema.lessons.id });

  await db.insert(coursesSchema.lessons).values([
    {
      moduleId: mod1.id,
      courseId: course.id,
      title: "Type Annotations & Inference",
      content: "# Type Annotations\n\nLearn how TypeScript infers types...",
      duration: 20,
      position: 1,
      isFree: false,
    },
    {
      moduleId: mod2.id,
      courseId: course.id,
      title: "Generics Deep Dive",
      content: "# Generics\n\nGenerics allow you to create reusable components...",
      duration: 25,
      position: 0,
      isFree: false,
    },
    {
      moduleId: mod2.id,
      courseId: course.id,
      title: "Utility Types",
      content: "# Utility Types\n\nPartial, Required, Pick, Omit, Record...",
      duration: 30,
      position: 1,
      isFree: false,
    },
  ]);

  console.log("✅ Course + Modules + Lessons created");

  // Quiz on first lesson
  const [quiz] = await db
    .insert(quizzesSchema.quizzes)
    .values({ lessonId: lesson1.id, title: "TypeScript Basics Quiz", passingScore: 70 })
    .returning({ id: quizzesSchema.quizzes.id });

  await db.insert(quizzesSchema.questions).values([
    {
      quizId: quiz.id,
      text: "What is TypeScript?",
      type: "MCQ",
      options: [
        { id: "a", text: "A CSS framework" },
        { id: "b", text: "A typed superset of JavaScript" },
        { id: "c", text: "A database" },
        { id: "d", text: "A testing library" },
      ],
      correctOptions: ["b"],
      position: 0,
    },
    {
      quizId: quiz.id,
      text: "Which of these are TypeScript features?",
      type: "MULTI",
      options: [
        { id: "a", text: "Type inference" },
        { id: "b", text: "Generics" },
        { id: "c", text: "DOM manipulation" },
        { id: "d", text: "Decorators" },
      ],
      correctOptions: ["a", "b", "d"],
      position: 1,
    },
  ]);

  console.log("✅ Quiz + Questions created");

  // Enrollment
  if (student) {
    await db
      .insert(learningSchema.enrollments)
      .values({ userId: student.id, courseId: course.id })
      .onConflictDoNothing();
    console.log("✅ Student enrolled");
  }

  await client.end();
  console.log("\n🎉 Seed complete!");
}

seed().catch(console.error);
