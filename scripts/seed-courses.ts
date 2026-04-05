import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client);

const CATEGORIES = [
  { name: "Web Development", slug: "web-development", description: "Build modern websites and web applications" },
  { name: "Data Science", slug: "data-science", description: "Analyze data and build ML models" },
  { name: "Mobile Development", slug: "mobile-development", description: "Create iOS and Android applications" },
  { name: "Cloud & DevOps", slug: "cloud-devops", description: "Deploy and manage cloud infrastructure" },
  { name: "Cybersecurity", slug: "cybersecurity", description: "Protect systems and networks from threats" },
];

interface CourseData {
  title: string; slug: string; description: string; price: string; category: string;
  modules: { title: string; lessons: { title: string; content: string; duration: number; isFree: boolean }[] }[];
}

const COURSES: CourseData[] = [
  {
    title: "Next.js 15 — The Complete Guide", slug: "nextjs-15-complete-guide", category: "web-development",
    description: "Master Next.js 15 with App Router, Server Components, Server Actions, and deployment strategies. Build production-grade full-stack applications from scratch.",
    price: "49.99",
    modules: [
      { title: "Getting Started with Next.js 15", lessons: [
        { title: "Why Next.js in 2026", content: "Next.js has become the de facto React framework for production. In this lesson we explore why companies like Vercel, Netflix, and TikTok rely on it.\n\n## Key Advantages\n- **Server Components** reduce client bundle size by up to 70%\n- **App Router** provides nested layouts and streaming\n- **Turbopack** offers 10x faster dev builds than Webpack\n- Built-in image, font, and script optimization", duration: 480, isFree: true },
        { title: "Project Setup & Folder Structure", content: "Create a new Next.js 15 project using `create-next-app` with TypeScript, Tailwind CSS 4, and ESLint.\n\n```bash\nnpx create-next-app@latest my-app --typescript --tailwind --app --src-dir\n```\n\n## Key Directories\n- `app/` — Routes and layouts\n- `components/` — Reusable UI components\n- `lib/` — Utilities and helpers\n- `server/` — Backend logic (tRPC, DB)", duration: 600, isFree: true },
        { title: "Understanding the App Router", content: "The App Router uses a file-system based routing convention where folders define routes.\n\n## Special Files\n| File | Purpose |\n|------|--------|\n| `page.tsx` | Route UI |\n| `layout.tsx` | Shared wrapper |\n| `loading.tsx` | Suspense fallback |\n| `error.tsx` | Error boundary |\n| `not-found.tsx` | 404 UI |", duration: 720, isFree: false },
      ]},
      { title: "Server Components & Data Fetching", lessons: [
        { title: "Server vs Client Components", content: "By default, components in the App Router are Server Components. They run only on the server, which means:\n\n1. **Zero JavaScript sent to the client** for rendering\n2. Direct access to databases, file systems, and secrets\n3. Automatic code splitting\n\nAdd `'use client'` directive only when you need interactivity (useState, useEffect, event handlers).", duration: 900, isFree: false },
        { title: "Data Fetching Patterns", content: "Next.js 15 supports multiple data fetching strategies:\n\n## Server-Side\n```tsx\n// This runs on the server automatically\nexport default async function Page() {\n  const data = await db.query.posts.findMany();\n  return <PostList posts={data} />;\n}\n```\n\n## Client-Side with React Query\nFor real-time data or user-specific content, use `@tanstack/react-query` with tRPC.", duration: 840, isFree: false },
      ]},
      { title: "Authentication & Deployment", lessons: [
        { title: "Auth with Better Auth", content: "Better Auth is a framework-agnostic authentication library. We'll set up email/password auth with role-based access.\n\n## Setup Steps\n1. Install: `npm i better-auth`\n2. Configure database adapter (Drizzle + PostgreSQL)\n3. Create API route handler at `/api/auth/[...all]`\n4. Build sign-in/sign-up forms\n5. Protect routes with middleware", duration: 1080, isFree: false },
        { title: "Deploying to Vercel", content: "Deploy your Next.js application to Vercel with zero configuration.\n\n## Checklist\n- Environment variables configured\n- Database connection string set\n- Edge middleware tested\n- Build passes locally (`npm run build`)\n- Performance audit with Lighthouse (aim for 90+)", duration: 600, isFree: false },
      ]},
    ],
  },
  {
    title: "TypeScript Mastery — From Zero to Advanced", slug: "typescript-mastery", category: "web-development",
    description: "Go from JavaScript developer to TypeScript expert. Cover generics, decorators, utility types, conditional types, and real-world patterns used in production codebases.",
    price: "39.99",
    modules: [
      { title: "TypeScript Foundations", lessons: [
        { title: "Why TypeScript Matters", content: "TypeScript catches bugs at compile time that would otherwise crash in production. Studies show TypeScript prevents ~15% of all JavaScript bugs.\n\n## Benefits\n- Intellisense and autocompletion\n- Safer refactoring\n- Self-documenting code\n- Better team collaboration", duration: 420, isFree: true },
        { title: "Types, Interfaces & Enums", content: "## Primitive Types\n```ts\nconst name: string = 'Alice';\nconst age: number = 30;\nconst active: boolean = true;\n```\n\n## Interfaces vs Types\n- **interface**: Extendable, best for object shapes\n- **type**: Flexible, supports unions and intersections\n\n```ts\ninterface User { id: string; name: string; role: 'admin' | 'user'; }\ntype Result<T> = { data: T; error: null } | { data: null; error: Error };\n```", duration: 780, isFree: true },
      ]},
      { title: "Advanced Patterns", lessons: [
        { title: "Generics Deep Dive", content: "Generics allow you to write reusable, type-safe functions and classes.\n\n```ts\nfunction getFirst<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\n// Type is inferred as number\nconst first = getFirst([1, 2, 3]);\n```\n\n## Constraints\n```ts\nfunction getLength<T extends { length: number }>(item: T): number {\n  return item.length;\n}\n```", duration: 900, isFree: false },
        { title: "Utility Types & Conditional Types", content: "TypeScript ships with powerful built-in utility types:\n\n| Type | Purpose |\n|------|--------|\n| `Partial<T>` | All props optional |\n| `Required<T>` | All props required |\n| `Pick<T, K>` | Select specific keys |\n| `Omit<T, K>` | Exclude specific keys |\n| `Record<K, V>` | Key-value mapping |\n\n## Conditional Types\n```ts\ntype IsString<T> = T extends string ? 'yes' : 'no';\ntype A = IsString<'hello'>; // 'yes'\n```", duration: 960, isFree: false },
      ]},
    ],
  },
  {
    title: "Python for Data Science & Machine Learning", slug: "python-data-science-ml", category: "data-science",
    description: "Learn Python programming for data analysis, visualization, and machine learning. Work with pandas, NumPy, scikit-learn, and real-world datasets.",
    price: "59.99",
    modules: [
      { title: "Python for Data Analysis", lessons: [
        { title: "Setting Up Your Data Science Environment", content: "Install Python, Jupyter Notebooks, and essential libraries.\n\n```bash\npip install numpy pandas matplotlib seaborn scikit-learn jupyter\njupyter notebook\n```\n\n## Key Libraries\n- **NumPy**: Numerical computing\n- **pandas**: Data manipulation\n- **matplotlib/seaborn**: Visualization\n- **scikit-learn**: Machine learning", duration: 540, isFree: true },
        { title: "pandas — Data Wrangling Essentials", content: "pandas is the backbone of data analysis in Python.\n\n```python\nimport pandas as pd\n\ndf = pd.read_csv('sales.csv')\nprint(df.head())\nprint(df.describe())\n\n# Filter and group\ntop_sales = df[df['revenue'] > 10000]\nby_region = df.groupby('region')['revenue'].sum()\n```", duration: 900, isFree: true },
      ]},
      { title: "Machine Learning Fundamentals", lessons: [
        { title: "Supervised Learning — Regression & Classification", content: "## Linear Regression\n```python\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\nprint(f'R² Score: {model.score(X_test, y_test):.2f}')\n```\n\nWe cover: Linear Regression, Logistic Regression, Decision Trees, Random Forests, and evaluation metrics.", duration: 1200, isFree: false },
        { title: "Model Evaluation & Cross-Validation", content: "Evaluating ML models properly prevents overfitting.\n\n## Key Metrics\n- **Accuracy**: Correct predictions / Total\n- **Precision**: True positives / (True + False positives)\n- **Recall**: True positives / (True + False negatives)\n- **F1 Score**: Harmonic mean of Precision and Recall\n\nAlways use **k-fold cross-validation** for reliable estimates.", duration: 780, isFree: false },
      ]},
    ],
  },
  {
    title: "SQL & Database Design for Analytics", slug: "sql-database-design-analytics", category: "data-science",
    description: "Master SQL from basics to advanced queries. Design efficient schemas, write complex joins, window functions, and CTEs for analytics workloads.",
    price: "29.99",
    modules: [
      { title: "SQL Fundamentals", lessons: [
        { title: "Your First SQL Queries", content: "SQL (Structured Query Language) is the language of data.\n\n```sql\nSELECT name, email, created_at\nFROM users\nWHERE role = 'STUDENT'\nORDER BY created_at DESC\nLIMIT 10;\n```\n\n## Core Commands\n- `SELECT` — Read data\n- `INSERT` — Add rows\n- `UPDATE` — Modify rows\n- `DELETE` — Remove rows", duration: 600, isFree: true },
        { title: "JOINs — Combining Tables", content: "## Types of JOINs\n```sql\n-- INNER JOIN: only matching rows\nSELECT u.name, c.title\nFROM enrollments e\nINNER JOIN users u ON e.user_id = u.id\nINNER JOIN courses c ON e.course_id = c.id;\n\n-- LEFT JOIN: all left + matching right\nSELECT c.title, COUNT(e.id) as students\nFROM courses c\nLEFT JOIN enrollments e ON c.id = e.course_id\nGROUP BY c.title;\n```", duration: 840, isFree: false },
      ]},
      { title: "Advanced SQL", lessons: [
        { title: "Window Functions & CTEs", content: "Window functions perform calculations across rows related to the current row.\n\n```sql\n-- Rank students by course completion\nSELECT user_id, course_id,\n  ROW_NUMBER() OVER (PARTITION BY course_id ORDER BY completed_at) as rank\nFROM progress;\n\n-- CTE for readability\nWITH monthly_revenue AS (\n  SELECT DATE_TRUNC('month', created_at) as month, SUM(amount) as total\n  FROM payments GROUP BY 1\n)\nSELECT month, total, LAG(total) OVER (ORDER BY month) as prev_month\nFROM monthly_revenue;\n```", duration: 1080, isFree: false },
      ]},
    ],
  },
  {
    title: "React Native — Build Cross-Platform Apps", slug: "react-native-cross-platform", category: "mobile-development",
    description: "Build native iOS and Android apps with React Native and Expo. Cover navigation, state management, native APIs, and App Store deployment.",
    price: "54.99",
    modules: [
      { title: "React Native Fundamentals", lessons: [
        { title: "Setting Up with Expo", content: "Expo simplifies React Native development with a managed workflow.\n\n```bash\nnpx create-expo-app@latest MyApp --template blank-typescript\ncd MyApp && npx expo start\n```\n\n## Core Components\n- `View` — like `div`\n- `Text` — for text content\n- `Image` — display images\n- `ScrollView` — scrollable container\n- `FlatList` — performant lists", duration: 600, isFree: true },
        { title: "Styling & Layout with Flexbox", content: "React Native uses Flexbox for layout, but defaults differ from web.\n\n```tsx\nconst styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    flexDirection: 'column', // default (unlike web's 'row')\n    justifyContent: 'center',\n    alignItems: 'center',\n    backgroundColor: '#0a0a0a',\n  },\n  title: {\n    fontSize: 24,\n    fontWeight: '700',\n    color: '#ffffff',\n  },\n});\n```", duration: 720, isFree: true },
      ]},
      { title: "Navigation & State", lessons: [
        { title: "React Navigation — Stack, Tab, Drawer", content: "React Navigation is the standard routing library for React Native.\n\n```tsx\nimport { createNativeStackNavigator } from '@react-navigation/native-stack';\n\nconst Stack = createNativeStackNavigator();\n\nexport default function App() {\n  return (\n    <NavigationContainer>\n      <Stack.Navigator>\n        <Stack.Screen name=\"Home\" component={HomeScreen} />\n        <Stack.Screen name=\"Details\" component={DetailsScreen} />\n      </Stack.Navigator>\n    </NavigationContainer>\n  );\n}\n```", duration: 900, isFree: false },
        { title: "State Management with Zustand", content: "Zustand is a lightweight state management library perfect for React Native.\n\n```tsx\nimport { create } from 'zustand';\n\ninterface CartStore {\n  items: CartItem[];\n  addItem: (item: CartItem) => void;\n  total: () => number;\n}\n\nconst useCartStore = create<CartStore>((set, get) => ({\n  items: [],\n  addItem: (item) => set((s) => ({ items: [...s.items, item] })),\n  total: () => get().items.reduce((sum, i) => sum + i.price, 0),\n}));\n```", duration: 780, isFree: false },
      ]},
    ],
  },
  {
    title: "Flutter & Dart — Modern Mobile Development", slug: "flutter-dart-modern-mobile", category: "mobile-development",
    description: "Build beautiful, natively compiled mobile apps with Flutter and Dart. Learn widgets, state management with Riverpod, and platform-specific integrations.",
    price: "49.99",
    modules: [
      { title: "Dart Language & Flutter Basics", lessons: [
        { title: "Dart Language Crash Course", content: "Dart is an object-oriented language optimized for UI.\n\n```dart\nvoid main() {\n  final name = 'Flutter'; // type inferred as String\n  final numbers = [1, 2, 3, 4, 5];\n  final doubled = numbers.map((n) => n * 2).toList();\n  print('$name: $doubled');\n}\n\nclass User {\n  final String name;\n  final int age;\n  const User({required this.name, required this.age});\n}\n```", duration: 720, isFree: true },
        { title: "Widget Tree & Material Design", content: "Everything in Flutter is a widget — the building block of your UI.\n\n```dart\nclass HomeScreen extends StatelessWidget {\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      appBar: AppBar(title: Text('My App')),\n      body: Center(\n        child: Column(\n          mainAxisAlignment: MainAxisAlignment.center,\n          children: [\n            Text('Hello Flutter', style: Theme.of(context).textTheme.headlineMedium),\n            SizedBox(height: 16),\n            ElevatedButton(onPressed: () {}, child: Text('Get Started')),\n          ],\n        ),\n      ),\n    );\n  }\n}\n```", duration: 840, isFree: false },
      ]},
    ],
  },
  {
    title: "AWS Cloud Practitioner — Certification Prep", slug: "aws-cloud-practitioner-cert", category: "cloud-devops",
    description: "Prepare for the AWS Certified Cloud Practitioner exam. Understand core AWS services, pricing, security, and architecture best practices.",
    price: "34.99",
    modules: [
      { title: "AWS Core Services", lessons: [
        { title: "Cloud Computing Fundamentals", content: "Cloud computing delivers IT resources over the internet with pay-as-you-go pricing.\n\n## Service Models\n- **IaaS** (EC2) — Virtual machines, full control\n- **PaaS** (Elastic Beanstalk) — Managed platform\n- **SaaS** (WorkMail) — Ready-to-use software\n\n## AWS Global Infrastructure\n- **Regions**: 33+ geographic locations\n- **Availability Zones**: 2-6 per region\n- **Edge Locations**: 400+ for CDN (CloudFront)", duration: 720, isFree: true },
        { title: "EC2, S3, and RDS Overview", content: "## Amazon EC2\nVirtual servers in the cloud. Choose instance type based on workload.\n\n## Amazon S3\nObject storage with 99.999999999% durability.\n```\ns3://my-bucket/images/photo.jpg\n```\nStorage classes: Standard, IA, Glacier, Deep Archive.\n\n## Amazon RDS\nManaged relational databases: PostgreSQL, MySQL, Aurora.\nAutomatic backups, patches, and scaling.", duration: 900, isFree: false },
      ]},
      { title: "Security & Pricing", lessons: [
        { title: "IAM & Security Best Practices", content: "## Identity and Access Management (IAM)\n- **Users**: Individual people\n- **Groups**: Collections of users\n- **Roles**: Temporary permissions for services\n- **Policies**: JSON documents defining permissions\n\n## Best Practices\n1. Enable MFA on root account\n2. Never use root for daily tasks\n3. Follow least-privilege principle\n4. Rotate access keys regularly\n5. Use IAM roles for EC2 instances", duration: 840, isFree: false },
      ]},
    ],
  },
  {
    title: "Docker & Kubernetes in Production", slug: "docker-kubernetes-production", category: "cloud-devops",
    description: "Containerize applications with Docker and orchestrate them with Kubernetes. Cover CI/CD pipelines, Helm charts, and production monitoring.",
    price: "59.99",
    modules: [
      { title: "Docker Essentials", lessons: [
        { title: "Containers vs Virtual Machines", content: "Containers share the host OS kernel, making them lightweight and fast.\n\n| Feature | Container | VM |\n|---------|-----------|----|\n| Startup | Seconds | Minutes |\n| Size | MBs | GBs |\n| Isolation | Process-level | Hardware-level |\n| Performance | Near-native | Overhead |\n\n```dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]\n```", duration: 660, isFree: true },
        { title: "Docker Compose for Multi-Service Apps", content: "Docker Compose defines multi-container applications.\n\n```yaml\nservices:\n  web:\n    build: .\n    ports: ['3000:3000']\n    depends_on: [db, redis]\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_DB: myapp\n      POSTGRES_PASSWORD: secret\n    volumes: ['pgdata:/var/lib/postgresql/data']\n  redis:\n    image: redis:7-alpine\nvolumes:\n  pgdata:\n```\n\nRun with: `docker compose up -d`", duration: 780, isFree: false },
      ]},
    ],
  },
  {
    title: "Ethical Hacking — Penetration Testing Fundamentals", slug: "ethical-hacking-pentest", category: "cybersecurity",
    description: "Learn ethical hacking methodology, reconnaissance, vulnerability assessment, exploitation techniques, and professional penetration testing report writing.",
    price: "64.99",
    modules: [
      { title: "Reconnaissance & Scanning", lessons: [
        { title: "Information Gathering Techniques", content: "Reconnaissance is the first phase of penetration testing.\n\n## Passive Recon\n- WHOIS lookups\n- DNS enumeration\n- Google dorking (`site:target.com filetype:pdf`)\n- Shodan searches\n- Social media OSINT\n\n## Active Recon\n- Port scanning with Nmap\n- Service version detection\n- OS fingerprinting\n\n```bash\nnmap -sV -sC -O target.com\n```", duration: 840, isFree: true },
        { title: "Vulnerability Scanning with Nmap & Nikto", content: "After identifying open ports, scan for known vulnerabilities.\n\n```bash\n# Nmap vulnerability scripts\nnmap --script vuln target.com\n\n# Web server scanning\nnikto -h https://target.com\n\n# Directory bruteforcing\ngobuster dir -u https://target.com -w /usr/share/wordlists/common.txt\n```\n\n## OWASP Top 10 (2025)\n1. Broken Access Control\n2. Cryptographic Failures\n3. Injection\n4. Insecure Design\n5. Security Misconfiguration", duration: 960, isFree: false },
      ]},
    ],
  },
  {
    title: "Application Security — Secure Coding Practices", slug: "application-security-secure-coding", category: "cybersecurity",
    description: "Write secure code from day one. Cover OWASP Top 10, input validation, authentication security, API protection, and security testing automation.",
    price: "44.99",
    modules: [
      { title: "Secure Coding Fundamentals", lessons: [
        { title: "OWASP Top 10 Deep Dive", content: "Every developer must understand the OWASP Top 10 vulnerabilities.\n\n## 1. Injection\n```js\n// ❌ VULNERABLE\nconst query = `SELECT * FROM users WHERE id = '${userId}'`;\n\n// ✅ SAFE — parameterized query\nconst result = await db.select().from(users).where(eq(users.id, userId));\n```\n\n## 2. Broken Authentication\n- Use bcrypt/scrypt for passwords (never MD5/SHA1)\n- Implement rate limiting\n- Enforce MFA for sensitive operations", duration: 900, isFree: true },
        { title: "Input Validation & Output Encoding", content: "Never trust user input. Validate on the server, encode on output.\n\n```typescript\n// Server-side validation with Zod\nconst createUserSchema = z.object({\n  email: z.string().email().max(255),\n  name: z.string().min(2).max(100).regex(/^[a-zA-Z\\s]+$/),\n  password: z.string().min(8).max(128),\n});\n\n// XSS prevention — output encoding\n// Use react-markdown with rehype-sanitize\nimport rehypeSanitize from 'rehype-sanitize';\n<ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>\n```", duration: 840, isFree: false },
      ]},
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding 10 courses across 5 categories...\n");

  // Get teacher ID
  const teachers = await db.execute(sql`SELECT id FROM users WHERE role = 'TEACHER' LIMIT 1`);
  let teacherId: string;
  if (teachers.length > 0) {
    teacherId = (teachers[0] as any).id;
    console.log(`   👩‍🏫 Using teacher: ${teacherId}`);
  } else {
    // Use admin as fallback
    const admins = await db.execute(sql`SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1`);
    if (admins.length === 0) { console.error("❌ No teacher or admin found"); process.exit(1); }
    teacherId = (admins[0] as any).id;
    console.log(`   👩‍🏫 Using admin as teacher: ${teacherId}`);
  }

  // Upsert categories
  const catMap = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const existing = await db.execute(sql`SELECT id FROM categories WHERE slug = ${cat.slug}`);
    if (existing.length > 0) {
      catMap.set(cat.slug, (existing[0] as any).id);
      console.log(`   📂 Category exists: ${cat.name}`);
    } else {
      const [inserted] = await db.execute(
        sql`INSERT INTO categories (name, slug, description) VALUES (${cat.name}, ${cat.slug}, ${cat.description}) RETURNING id`
      );
      catMap.set(cat.slug, (inserted as any).id);
      console.log(`   ✅ Created category: ${cat.name}`);
    }
  }

  // Seed billing plans
  const existingPlans = await db.execute(sql`SELECT id FROM plans LIMIT 1`);
  if (existingPlans.length === 0) {
    await db.execute(sql`
      INSERT INTO plans (name, slug, description, price, interval, features, is_popular, sort_order) VALUES
        ('Monthly', 'monthly', 'Billed every month', '19.99', 'MONTHLY', ARRAY['Unlimited course access','Community forums','Monthly webinars','Email support'], false, 1),
        ('Yearly', 'yearly', 'Save 40% annually', '119.99', 'YEARLY', ARRAY['Everything in Monthly','Priority support','Downloadable resources','Certificate of completion','1-on-1 mentorship sessions'], true, 2),
        ('Lifetime', 'lifetime', 'Pay once, learn forever', '299.99', 'LIFETIME', ARRAY['Everything in Yearly','Lifetime access','Future course updates','Private Slack community','Early access to new courses'], false, 3)
    `);
    console.log("   💳 Created billing plans");
  }

  // Seed courses
  for (const course of COURSES) {
    const categoryId = catMap.get(course.category)!;
    const existing = await db.execute(sql`SELECT id FROM courses WHERE slug = ${course.slug}`);
    if (existing.length > 0) {
      console.log(`   ⏭️  Skipping existing: ${course.title}`);
      continue;
    }

    const totalDuration = course.modules.reduce((s, m) => s + m.lessons.reduce((s2, l) => s2 + l.duration, 0), 0);

    const [inserted] = await db.execute(
      sql`INSERT INTO courses (slug, title, description, price, status, approved, teacher_id, category_id, total_duration)
          VALUES (${course.slug}, ${course.title}, ${course.description}, ${course.price}, 'PUBLISHED', true, ${teacherId}, ${categoryId}, ${totalDuration})
          RETURNING id`
    );
    const courseId = (inserted as any).id;

    for (let mi = 0; mi < course.modules.length; mi++) {
      const mod = course.modules[mi];
      const [insertedMod] = await db.execute(
        sql`INSERT INTO modules (course_id, title, position) VALUES (${courseId}, ${mod.title}, ${mi + 1}) RETURNING id`
      );
      const moduleId = (insertedMod as any).id;

      for (let li = 0; li < mod.lessons.length; li++) {
        const lesson = mod.lessons[li];
        await db.execute(
          sql`INSERT INTO lessons (module_id, course_id, title, content, duration, position, is_free)
              VALUES (${moduleId}, ${courseId}, ${lesson.title}, ${lesson.content}, ${lesson.duration}, ${li + 1}, ${lesson.isFree})`
        );
      }
    }
    console.log(`   ✅ ${course.title} (${course.modules.reduce((s, m) => s + m.lessons.length, 0)} lessons)`);
  }

  await client.end();
  console.log("\n🎉 Seed complete! 10 courses across 5 categories.");
}

seed().catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); });
