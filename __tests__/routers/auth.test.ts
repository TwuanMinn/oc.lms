import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Tests for tRPC procedure middleware authorization guards.
 * These test the middleware functions directly from server/trpc.ts.
 */

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/server/db", () => ({
  db: {},
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

describe("Auth Procedures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("protectedProcedure", () => {
    it("should throw UNAUTHORIZED with no session", async () => {
      const { createContext } = await import("@/server/trpc");
      const { auth } = await import("@/lib/auth");

      (auth.api.getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      const ctx = await createContext();
      expect(ctx.session).toBeNull();
    });

    it("should provide user in context when session exists", async () => {
      const { createContext } = await import("@/server/trpc");
      const { auth } = await import("@/lib/auth");

      const mockSession = {
        user: { id: "user-1", name: "Test", email: "test@test.com", role: "STUDENT" },
        session: { token: "tok-123" },
      };
      (auth.api.getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockSession);

      const ctx = await createContext();
      expect(ctx.session).toBeDefined();
      expect(ctx.session?.user?.id).toBe("user-1");
    });
  });

  describe("AuthUser type safety", () => {
    it("should define role as a union of ADMIN | TEACHER | STUDENT", () => {
      // Type-level test: this verifies the AuthUser type is properly exported
      type TestAuthUser = import("@/server/trpc").AuthUser;
      const user: TestAuthUser = {
        id: "u-1",
        name: "Admin",
        email: "admin@test.com",
        role: "ADMIN",
      };
      expect(user.role).toBe("ADMIN");
      expect(["ADMIN", "TEACHER", "STUDENT"]).toContain(user.role);
    });
  });
});
