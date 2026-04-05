import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as usersSchema from "../server/db/schema/users";
import * as coursesSchema from "../server/db/schema/courses";
import * as learningSchema from "../server/db/schema/learning";
import * as quizzesSchema from "../server/db/schema/quizzes";
import { hashPassword } from "better-auth/crypto";

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL not set in .env");
    process.exit(1);
  }

  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client, {
    schema: { ...usersSchema, ...coursesSchema, ...learningSchema, ...quizzesSchema },
  });

  console.log("🌱 Seeding database...\n");

  const passwordHash = await hashPassword("Admin123!");

  // ── Users ──
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
      bio: "Full-stack developer with 10 years of experience building production applications.",
      emailVerified: true,
    })
    .onConflictDoNothing({ target: usersSchema.users.email })
    .returning({ id: usersSchema.users.id });

  const [teacher2] = await db
    .insert(usersSchema.users)
    .values({
      name: "Mark Instructor",
      email: "mark@lms.dev",
      passwordHash,
      role: "TEACHER",
      bio: "Data scientist and machine learning engineer. Passionate about teaching.",
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

  // ── Accounts (better-auth credential store) ──
  const userList = [
    { user: admin, email: "admin@lms.dev" },
    { user: teacher, email: "teacher@lms.dev" },
    { user: teacher2, email: "mark@lms.dev" },
    { user: student, email: "student@lms.dev" },
  ];

  for (const { user } of userList) {
    if (user) {
      await db
        .insert(usersSchema.accounts)
        .values({
          userId: user.id,
          accountId: user.id,
          providerId: "credential",
          password: passwordHash,
        })
        .onConflictDoNothing();
    }
  }

  console.log("✅ Accounts created (auth credentials)");

  // ── Categories ──
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

  const [designCat] = await db
    .insert(coursesSchema.categories)
    .values({ name: "Design", slug: "design" })
    .onConflictDoNothing({ target: coursesSchema.categories.slug })
    .returning({ id: coursesSchema.categories.id });

  console.log("✅ Categories created");

  if (!teacher || !webCat) {
    console.log("⚠️ Skipping courses — teacher or category data already exists. Seed is idempotent.");
    await client.end();
    return;
  }

  // ── Course 1: TypeScript Masterclass ──
  const [course1] = await db
    .insert(coursesSchema.courses)
    .values({
      title: "Complete TypeScript Masterclass",
      slug: "complete-typescript-masterclass",
      description:
        "Master TypeScript from basics to advanced patterns. Learn generics, utility types, decorators, and build production-ready applications.",
      price: "0",
      status: "PUBLISHED",
      approved: true,
      teacherId: teacher.id,
      categoryId: webCat.id,
      totalDuration: 120,
    })
    .returning({ id: coursesSchema.courses.id });

  const [mod1] = await db
    .insert(coursesSchema.modules)
    .values({ courseId: course1.id, title: "Getting Started", position: 0 })
    .returning({ id: coursesSchema.modules.id });

  const [mod2] = await db
    .insert(coursesSchema.modules)
    .values({ courseId: course1.id, title: "Advanced Types", position: 1 })
    .returning({ id: coursesSchema.modules.id });

  const [lesson1] = await db
    .insert(coursesSchema.lessons)
    .values({
      moduleId: mod1.id,
      courseId: course1.id,
      title: "Introduction to TypeScript",
      description: "Why TypeScript? Setting up your environment.",
      content:
        "# Introduction to TypeScript\n\nTypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static type checking along with the latest ECMAScript features.\n\n## Why TypeScript?\n\n- **Type Safety**: Catch errors at compile time rather than runtime\n- **Better IDE Support**: Autocompletion, navigation, and refactoring\n- **Self-documenting**: Types serve as living documentation\n- **Enterprise Ready**: Used by Microsoft, Google, Airbnb, and more\n\n## Setting Up\n\n```bash\nnpm install -g typescript\ntsc --init\n```\n\nThis creates a `tsconfig.json` file where you can configure the compiler options.",
      duration: 15,
      position: 0,
      isFree: true,
    })
    .returning({ id: coursesSchema.lessons.id });

  await db.insert(coursesSchema.lessons).values([
    {
      moduleId: mod1.id,
      courseId: course1.id,
      title: "Type Annotations & Inference",
      content:
        "# Type Annotations\n\nTypeScript can infer types automatically, but you can also be explicit.\n\n```typescript\nlet name: string = 'Hello';\nlet age: number = 25;\nlet isActive: boolean = true;\n```\n\n## Type Inference\n\nTypeScript is smart enough to figure out types:\n\n```typescript\nlet message = 'Hello'; // inferred as string\n```",
      duration: 20,
      position: 1,
      isFree: false,
    },
    {
      moduleId: mod2.id,
      courseId: course1.id,
      title: "Generics Deep Dive",
      content:
        "# Generics\n\nGenerics allow you to create reusable components that work with multiple types.\n\n```typescript\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n\nconst result = identity<string>('hello');\n```\n\n## Generic Constraints\n\n```typescript\ninterface HasLength {\n  length: number;\n}\n\nfunction logLength<T extends HasLength>(arg: T): T {\n  console.log(arg.length);\n  return arg;\n}\n```",
      duration: 25,
      position: 0,
      isFree: false,
    },
    {
      moduleId: mod2.id,
      courseId: course1.id,
      title: "Utility Types",
      content:
        "# Utility Types\n\nTypeScript provides several built-in utility types:\n\n- `Partial<T>` — Makes all properties optional\n- `Required<T>` — Makes all properties required\n- `Pick<T, K>` — Picks specified properties\n- `Omit<T, K>` — Omits specified properties\n- `Record<K, V>` — Creates an object type\n\n```typescript\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\ntype UserUpdate = Partial<User>;\ntype UserPreview = Pick<User, 'id' | 'name'>;\n```",
      duration: 30,
      position: 1,
      isFree: false,
    },
  ]);

  console.log("✅ Course 1 — TypeScript Masterclass created");

  // ── Course 2: Next.js Full-Stack ──
  const [course2] = await db
    .insert(coursesSchema.courses)
    .values({
      title: "Next.js Full-Stack Development",
      slug: "nextjs-full-stack-development",
      description:
        "Build production-ready full-stack applications with Next.js 15, React Server Components, Server Actions, and modern deployment strategies.",
      price: "29.99",
      status: "PUBLISHED",
      approved: true,
      teacherId: teacher.id,
      categoryId: webCat.id,
      totalDuration: 240,
    })
    .returning({ id: coursesSchema.courses.id });

  const [nMod1] = await db
    .insert(coursesSchema.modules)
    .values({ courseId: course2.id, title: "Foundations", position: 0 })
    .returning({ id: coursesSchema.modules.id });

  const [nMod2] = await db
    .insert(coursesSchema.modules)
    .values({ courseId: course2.id, title: "Data & API Layer", position: 1 })
    .returning({ id: coursesSchema.modules.id });

  const [nMod3] = await db
    .insert(coursesSchema.modules)
    .values({ courseId: course2.id, title: "Authentication & Deployment", position: 2 })
    .returning({ id: coursesSchema.modules.id });

  await db.insert(coursesSchema.lessons).values([
    {
      moduleId: nMod1.id,
      courseId: course2.id,
      title: "App Router & File-Based Routing",
      description: "Understanding the Next.js 15 App Router.",
      content: "# App Router\n\nThe App Router uses the `app/` directory for file-based routing with support for layouts, loading states, and error boundaries.",
      duration: 30,
      position: 0,
      isFree: true,
    },
    {
      moduleId: nMod1.id,
      courseId: course2.id,
      title: "Server vs Client Components",
      content: "# Server Components\n\nBy default, all components in the App Router are React Server Components (RSC). They run on the server and can fetch data directly.\n\nUse `'use client'` directive to opt into client-side rendering.",
      duration: 25,
      position: 1,
      isFree: false,
    },
    {
      moduleId: nMod2.id,
      courseId: course2.id,
      title: "tRPC Integration",
      content: "# tRPC with Next.js\n\nType-safe APIs without code generation. tRPC leverages TypeScript to provide end-to-end type safety between your server and client.",
      duration: 35,
      position: 0,
      isFree: false,
    },
    {
      moduleId: nMod2.id,
      courseId: course2.id,
      title: "Database with Drizzle ORM",
      content: "# Drizzle ORM\n\nA lightweight TypeScript ORM that gives you full SQL control with type safety. Define your schema with TypeScript, get full type inference.",
      duration: 40,
      position: 1,
      isFree: false,
    },
    {
      moduleId: nMod3.id,
      courseId: course2.id,
      title: "Authentication with Better Auth",
      content: "# Authentication\n\nBetter Auth provides a full-featured authentication system with session management, OAuth providers, and role-based access control.",
      duration: 30,
      position: 0,
      isFree: false,
    },
    {
      moduleId: nMod3.id,
      courseId: course2.id,
      title: "Deploying to Production",
      content: "# Deployment\n\nLearn to deploy your Next.js app to Vercel, Docker, or self-hosted environments with proper CI/CD pipelines.",
      duration: 35,
      position: 1,
      isFree: false,
    },
  ]);

  console.log("✅ Course 2 — Next.js Full-Stack created");

  // ── Course 3: Python Data Science ──
  if (teacher2 && dataCat) {
    const [course3] = await db
      .insert(coursesSchema.courses)
      .values({
        title: "Python for Data Science",
        slug: "python-data-science",
        description:
          "Learn Python data analysis with Pandas, NumPy, and Matplotlib. Build real-world data pipelines and visualizations.",
        price: "19.99",
        status: "PUBLISHED",
        approved: true,
        teacherId: teacher2.id,
        categoryId: dataCat.id,
        totalDuration: 180,
      })
      .returning({ id: coursesSchema.courses.id });

    const [pMod1] = await db
      .insert(coursesSchema.modules)
      .values({ courseId: course3.id, title: "Python Essentials", position: 0 })
      .returning({ id: coursesSchema.modules.id });

    const [pMod2] = await db
      .insert(coursesSchema.modules)
      .values({ courseId: course3.id, title: "Data Analysis", position: 1 })
      .returning({ id: coursesSchema.modules.id });

    await db.insert(coursesSchema.lessons).values([
      {
        moduleId: pMod1.id,
        courseId: course3.id,
        title: "Python Crash Course",
        content: "# Python Basics\n\nVariables, data types, control flow, and functions — everything you need to get started with Python.",
        duration: 25,
        position: 0,
        isFree: true,
      },
      {
        moduleId: pMod1.id,
        courseId: course3.id,
        title: "Working with Files & APIs",
        content: "# Files & APIs\n\nLearn to read CSV files, make HTTP requests, and process JSON data with Python's built-in libraries.",
        duration: 30,
        position: 1,
        isFree: false,
      },
      {
        moduleId: pMod2.id,
        courseId: course3.id,
        title: "Pandas DataFrames",
        content: "# Pandas\n\nThe backbone of data analysis in Python. Learn to manipulate tabular data with DataFrames — filtering, grouping, merging, and reshaping.",
        duration: 40,
        position: 0,
        isFree: false,
      },
      {
        moduleId: pMod2.id,
        courseId: course3.id,
        title: "Data Visualization with Matplotlib",
        content: "# Matplotlib & Seaborn\n\nCreate publication-quality charts: line plots, bar charts, heatmaps, and scatter plots.",
        duration: 35,
        position: 1,
        isFree: false,
      },
    ]);

    console.log("✅ Course 3 — Python Data Science created");
  }

  // ── Course 4: UI/UX Design (Design category) ──
  if (designCat) {
    const designTeacherId = teacher2?.id ?? teacher.id;
    await db
      .insert(coursesSchema.courses)
      .values({
        title: "Modern UI/UX Design Principles",
        slug: "modern-ui-ux-design",
        description:
          "Master the fundamentals of user interface and user experience design. Learn Figma, design systems, accessibility, and user research.",
        price: "0",
        status: "PUBLISHED",
        approved: true,
        teacherId: designTeacherId,
        categoryId: designCat.id,
        totalDuration: 90,
      });

    console.log("✅ Course 4 — UI/UX Design created (no lessons — for catalog variety)");
  }

  // ── Quizzes ──
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

  // ── Enrollments ──
  if (student) {
    await db
      .insert(learningSchema.enrollments)
      .values({ userId: student.id, courseId: course1.id })
      .onConflictDoNothing();

    await db
      .insert(learningSchema.enrollments)
      .values({ userId: student.id, courseId: course2.id })
      .onConflictDoNothing();

    console.log("✅ Student enrolled in 2 courses");
  }

  await client.end();
  console.log("\n🎉 Seed complete! Login credentials:");
  console.log("   Admin:   admin@lms.dev   / Admin123!");
  console.log("   Teacher: teacher@lms.dev / Admin123!");
  console.log("   Student: student@lms.dev / Admin123!");
}

seed().catch(console.error);
