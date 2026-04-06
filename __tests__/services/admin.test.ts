import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock server-only
vi.mock("server-only", () => ({}));

// Mock the db module
const mockExecute = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockUpdate = vi.fn();
const mockSet = vi.fn();
const mockInsert = vi.fn();
const mockValues = vi.fn();
const mockReturning = vi.fn();

vi.mock("@/server/db", () => ({
  db: {
    select: () => ({ from: () => ({ where: () => ({ limit: () => ({ offset: () => ({ orderBy: () => [] }) }) }) }) }),
    update: () => ({ set: () => ({ where: () => ({ returning: () => [{ id: "test-id", role: "TEACHER" }] }) }) }),
    insert: () => ({ values: () => ({ returning: () => [{ id: "test-id", name: "Test", email: "test@test.com", role: "STUDENT" }] }) }),
    execute: () => Promise.resolve([{ total: 100 }]),
  },
}));

vi.mock("better-auth/crypto", () => ({
  hashPassword: vi.fn().mockResolvedValue("hashed-password"),
}));

describe("admin.service", () => {
  describe("banUser", () => {
    it("should throw when admin tries to ban themselves", async () => {
      const { banUser } = await import("@/server/services/admin.service");
      await expect(banUser("admin-123", "admin-123")).rejects.toThrow(
        "You cannot ban yourself"
      );
    });

    it("should not throw when banning a different user", async () => {
      const { banUser } = await import("@/server/services/admin.service");
      // Will succeed because mocked db returns successfully
      const result = await banUser("user-456", "admin-123");
      expect(result).toEqual({ success: true });
    });
  });

  describe("deleteUser", () => {
    it("should throw when admin tries to delete themselves", async () => {
      const { deleteUser } = await import("@/server/services/admin.service");
      await expect(deleteUser("admin-123", "admin-123")).rejects.toThrow(
        "You cannot delete yourself"
      );
    });
  });
});
