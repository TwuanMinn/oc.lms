import "server-only";
import { eq, and, asc, gt, or, isNull } from "drizzle-orm";
import { db } from "@/server/db";
import { plans, subscriptions } from "@/server/db/schema/billing";

export async function getActivePlans() {
  return db
    .select()
    .from(plans)
    .where(eq(plans.isActive, true))
    .orderBy(asc(plans.sortOrder));
}

export async function getPlanBySlug(slug: string) {
  const [plan] = await db
    .select()
    .from(plans)
    .where(and(eq(plans.slug, slug), eq(plans.isActive, true)));
  return plan ?? null;
}

export async function getActiveSubscription(userId: string) {
  const [sub] = await db
    .select({
      id: subscriptions.id,
      planId: subscriptions.planId,
      status: subscriptions.status,
      startDate: subscriptions.startDate,
      endDate: subscriptions.endDate,
      planName: plans.name,
      planSlug: plans.slug,
    })
    .from(subscriptions)
    .innerJoin(plans, eq(subscriptions.planId, plans.id))
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "ACTIVE"),
        or(isNull(subscriptions.endDate), gt(subscriptions.endDate, new Date()))
      )
    );
  return sub ?? null;
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const sub = await getActiveSubscription(userId);
  return !!sub;
}

export async function subscribe(userId: string, planId: string) {
  const [plan] = await db
    .select()
    .from(plans)
    .where(eq(plans.id, planId));

  if (!plan) throw new Error("Plan not found");

  let endDate: Date | null = null;
  const now = new Date();

  if (plan.interval === "MONTHLY") {
    endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (plan.interval === "YEARLY") {
    endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  // LIFETIME has no endDate

  const [sub] = await db
    .insert(subscriptions)
    .values({
      userId,
      planId,
      status: "ACTIVE",
      startDate: now,
      endDate,
    })
    .returning();

  return sub;
}
