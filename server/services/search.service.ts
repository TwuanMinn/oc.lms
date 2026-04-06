import "server-only";
import { sql } from "drizzle-orm";
import { db } from "@/server/db";
import { courses } from "@/server/db/schema/courses";
import { users } from "@/server/db/schema/users";

// #12: Extracted from search.router.ts for consistency and testability
export async function searchCourses(input: {
  query: string;
  limit: number;
  offset: number;
}) {
  const sanitizedQuery = input.query
    .replace(/[!&|():*<>@'"\\]/g, " ")
    .trim();
  if (!sanitizedQuery) return [];

  return db
    .select({
      id: courses.id,
      slug: courses.slug,
      title: courses.title,
      description: courses.description,
      thumbnail: courses.thumbnail,
      teacherName: users.name,
    })
    .from(courses)
    .leftJoin(users, sql`${courses.teacherId} = ${users.id}`)
    .where(
      sql`${courses.status} = 'PUBLISHED' AND ${courses.deletedAt} IS NULL AND to_tsvector('english', ${courses.title} || ' ' || coalesce(${courses.description}, '')) @@ plainto_tsquery('english', ${sanitizedQuery})`
    )
    .orderBy(
      sql`ts_rank(to_tsvector('english', ${courses.title} || ' ' || coalesce(${courses.description}, '')), plainto_tsquery('english', ${sanitizedQuery})) DESC`
    )
    .limit(input.limit)
    .offset(input.offset);
}
