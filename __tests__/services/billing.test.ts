import { describe, it, expect, vi } from "vitest";

// Mock server-only
vi.mock("server-only", () => ({}));

// Mock db
vi.mock("@/server/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => []),
        innerJoin: vi.fn(() => ({
          where: vi.fn(() => []),
        })),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => [{ id: "sub-1", planId: "plan-1", status: "ACTIVE" }]),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve()),
      })),
    })),
  },
}));

describe("billing.service", () => {
  describe("hasActiveSubscription", () => {
    it("should return false when no subscription exists", async () => {
      const { hasActiveSubscription } = await import("@/server/services/billing.service");
      const result = await hasActiveSubscription("user-without-sub");
      expect(result).toBe(false);
    });
  });

  describe("cancelSubscription", () => {
    it("should throw when no active subscription to cancel", async () => {
      const { cancelSubscription } = await import("@/server/services/billing.service");
      await expect(cancelSubscription("user-without-sub")).rejects.toThrow(
        "No active subscription to cancel"
      );
    });
  });
});
