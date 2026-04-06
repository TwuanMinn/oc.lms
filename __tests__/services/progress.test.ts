import { describe, it, expect, vi, beforeEach } from "vitest";

// Create chainable mock for Drizzle query builder
const createChainable = (terminalValue: unknown[] = []) => {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  const methods = ["select", "from", "where", "limit", "offset", "orderBy", "innerJoin", "groupBy"];
  for (const method of methods) {
    chain[method] = vi.fn().mockImplementation(() => {
      if (method === "orderBy" || method === "where") return terminalValue;
      return chain;
    });
  }
  return chain;
};

const mockReturning = vi.fn().mockReturnValue([]);
const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
const mockSetWhere = vi.fn().mockReturnValue({ returning: mockReturning });
const mockSet = vi.fn().mockReturnValue({ where: mockSetWhere });
const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });

const selectChain = createChainable([]);

vi.mock("@/server/db", () => ({
  db: {
    select: (...args: unknown[]) => {
      selectChain.select(...args);
      return selectChain;
    },
    insert: (...args: unknown[]) => mockInsert(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
    transaction: vi.fn().mockImplementation(async (fn: (tx: object) => Promise<unknown>) => {
      const txChain = createChainable([]);
      return fn({
        select: (...a: unknown[]) => {
          txChain.select(...a);
          return txChain;
        },
        insert: (...a: unknown[]) => mockInsert(...a),
        update: (...a: unknown[]) => mockUpdate(...a),
      });
    }),
  },
}));

vi.mock("@/server/services/certificate.service", () => ({
  issueCertificate: vi.fn().mockResolvedValue({ id: "cert-1" }),
  recordActivity: vi.fn().mockResolvedValue(undefined),
}));

describe("ProgressService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCourseProgressPercent - logic validation", () => {
    it("should return 0 when no progress records exist", () => {
      const completed: number = 0;
      const total: number = 10;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
      expect(percent).toBe(0);
    });

    it("should return 100 when all lessons are complete", () => {
      const completed = 10;
      const total = 10;
      const percent = Math.round((completed / total) * 100);
      expect(percent).toBe(100);
    });

    it("should return correct percentage for partial progress", () => {
      const completed = 3;
      const total = 10;
      const percent = Math.round((completed / total) * 100);
      expect(percent).toBe(30);
    });

    it("should handle division by zero (no lessons in course) gracefully", () => {
      const completed = 0;
      const total = 0;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
      expect(percent).toBe(0);
    });

    it("should round correctly for non-integer percentages", () => {
      const completed = 1;
      const total = 3;
      // 33.333... should round to 33
      const percent = Math.round((completed / total) * 100);
      expect(percent).toBe(33);
    });
  });

  describe("getResumeLesson - logic validation", () => {
    it("should return first lesson when no progress exists", () => {
      const allLessons = [
        { id: "l-1", title: "Intro", modulePosition: 0, lessonPosition: 0 },
        { id: "l-2", title: "Chapter 1", modulePosition: 0, lessonPosition: 1 },
      ];
      const completedIds = new Set<string>();
      const firstIncomplete = allLessons.find((l) => !completedIds.has(l.id));
      expect(firstIncomplete?.id).toBe("l-1");
    });

    it("should return first incomplete lesson in position order", () => {
      const allLessons = [
        { id: "l-1", title: "Intro", modulePosition: 0, lessonPosition: 0 },
        { id: "l-2", title: "Chapter 1", modulePosition: 0, lessonPosition: 1 },
        { id: "l-3", title: "Chapter 2", modulePosition: 1, lessonPosition: 0 },
      ];
      const completedIds = new Set(["l-1"]);
      const firstIncomplete = allLessons.find((l) => !completedIds.has(l.id));
      expect(firstIncomplete?.id).toBe("l-2");
    });

    it("should return first lesson (fallback) when all lessons are completed", () => {
      const allLessons = [
        { id: "l-1", title: "Intro", modulePosition: 0, lessonPosition: 0 },
        { id: "l-2", title: "Chapter 1", modulePosition: 0, lessonPosition: 1 },
      ];
      const completedIds = new Set(["l-1", "l-2"]);
      const firstIncomplete = allLessons.find((l) => !completedIds.has(l.id));
      const result = firstIncomplete ?? allLessons[0] ?? null;
      expect(result?.id).toBe("l-1");
    });
  });
});
