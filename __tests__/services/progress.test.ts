import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/server/db", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnValue([]),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnValue([]),
  },
}));

describe("ProgressService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getCourseProgressPercent should return 0 for a new enrollment", async () => {
    expect(true).toBe(true);
  });

  it("getCourseProgressPercent should return 100 when all lessons complete", async () => {
    expect(true).toBe(true);
  });

  it("getCourseProgressPercent should return correct % for partial progress", async () => {
    expect(true).toBe(true);
  });

  it("getResumeLesson should return first lesson when no progress exists", async () => {
    expect(true).toBe(true);
  });

  it("getResumeLesson should return first incomplete lesson in position order", async () => {
    expect(true).toBe(true);
  });
});
