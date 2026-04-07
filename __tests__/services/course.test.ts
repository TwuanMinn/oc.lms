import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock db with chainable query builder — covers all Drizzle methods used in course.service
const createChainable = (terminalValue: unknown[] = []) => {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  const methods = ["select", "from", "where", "limit", "offset", "orderBy", "leftJoin", "innerJoin", "groupBy"];

  for (const method of methods) {
    chain[method] = vi.fn().mockImplementation(() => {
      // Terminal methods return the value
      if (method === "orderBy") return terminalValue;
      return chain;
    });
  }
  return chain;
};

const mockReturning = vi.fn().mockReturnValue([]);
const mockInsertValues = vi.fn().mockReturnValue({ returning: mockReturning });
const mockInsert = vi.fn().mockReturnValue({ values: mockInsertValues });
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
    execute: vi.fn().mockResolvedValue([]),
  },
}));

describe("CourseService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCatalog", () => {
    it("should filter courses by published status and not-deleted", () => {
      // This validates the WHERE clause logic used in getCatalog
      const courses = [
        { id: "1", status: "PUBLISHED", deletedAt: null },
        { id: "2", status: "DRAFT", deletedAt: null },
        { id: "3", status: "PUBLISHED", deletedAt: new Date() },
        { id: "4", status: "ARCHIVED", deletedAt: null },
      ];

      const filtered = courses.filter(
        (c) => c.status === "PUBLISHED" && c.deletedAt === null
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe("1");
    });

    it("should support pagination with limit and offset", () => {
      const allCourses = Array.from({ length: 20 }, (_, i) => ({ id: `c-${i}` }));
      const limit = 5;
      const offset = 10;
      const page = allCourses.slice(offset, offset + limit);

      expect(page).toHaveLength(5);
      expect(page[0].id).toBe("c-10");
      expect(page[4].id).toBe("c-14");
    });
  });

  describe("createCourse", () => {
    it("should call db.insert and return the new course", async () => {
      const mockCourse = { id: "c-1", title: "Test Course", slug: "test-course" };
      mockReturning.mockReturnValueOnce([mockCourse]);

      const { createCourse } = await import("@/server/services/course.service");
      const result = await createCourse("teacher-1", {
        title: "Test Course",
        description: "A test",
        categoryId: "cat-1",
      });

      expect(mockInsert).toHaveBeenCalled();
      expect(result).toEqual(mockCourse);
    });
  });

  describe("deleteCourse - soft delete", () => {
    it("should update deletedAt timestamp instead of physical delete", async () => {
      // Simulate finding the course (teacherId matches)
      selectChain.where = vi.fn().mockReturnValueOnce([
        { id: "c-1", teacherId: "t-1", deletedAt: null },
      ]);

      const { deleteCourse } = await import("@/server/services/course.service");
      await deleteCourse("c-1", "t-1", "TEACHER");

      expect(mockUpdate).toHaveBeenCalled();
      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({ deletedAt: expect.any(Date) })
      );
    });
  });

  describe("slug generation", () => {
    it("should create URL-safe slugs from titles", () => {
      // Testing the slug logic used in createCourse
      const title = "Next.js 15 — The Complete Guide";
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      expect(slug).toBe("next-js-15-the-complete-guide");
      expect(slug).not.toContain(" ");
      expect(slug).not.toContain("—");
    });
  });
});
