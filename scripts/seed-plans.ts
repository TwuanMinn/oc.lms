import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plans } from "../server/db/schema/billing";

async function seedPlans() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL not set");
    process.exit(1);
  }

  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client);

  console.log("🌱 Seeding pricing plans...\n");

  await db.insert(plans).values([
    {
      name: "Monthly",
      slug: "monthly",
      description: "Flexible month-to-month access",
      price: "19",
      interval: "MONTHLY",
      features: [
        "Access to all courses",
        "Quizzes & certificates",
        "Progress tracking",
        "Cancel anytime",
      ],
      isPopular: false,
      sortOrder: 0,
    },
    {
      name: "Yearly",
      slug: "yearly",
      description: "Save 50% with annual billing",
      price: "99",
      interval: "YEARLY",
      features: [
        "Everything in Monthly",
        "Save 50% vs monthly",
        "Priority support",
        "Early access to new courses",
      ],
      isPopular: true,
      sortOrder: 1,
    },
    {
      name: "Lifetime",
      slug: "lifetime",
      description: "Pay once, learn forever",
      price: "249",
      interval: "LIFETIME",
      features: [
        "Everything in Yearly",
        "One-time payment",
        "Lifetime access — forever",
        "All future courses included",
        "Founding member badge",
      ],
      isPopular: false,
      sortOrder: 2,
    },
  ]).onConflictDoNothing({ target: plans.slug });

  console.log("✅ Plans created");

  await client.end();
  console.log("🎉 Plan seed complete!");
}

seedPlans().catch(console.error);
