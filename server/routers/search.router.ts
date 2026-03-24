import { z } from "zod";
import { sql } from "drizzle-orm";
import { router, publicProcedure } from "@/server/trpc";
import { db } from "@/server/db";
import { courses } from "@/server/db/schema/courses";
import { users } from "@/server/db/schema/users";

export const searchRouter = router({
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(200),
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const results = await db
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
          sql`${courses.status} = 'PUBLISHED' AND ${courses.deletedAt} IS NULL AND to_tsvector('english', ${courses.title} || ' ' || coalesce(${courses.description}, '')) @@ plainto_tsquery('english', ${input.query})`
        )
        .orderBy(
          sql`ts_rank(to_tsvector('english', ${courses.title} || ' ' || coalesce(${courses.description}, '')), plainto_tsquery('english', ${input.query})) DESC`
        )
        .limit(input.limit)
        .offset(input.offset);

      return results;
    }),
});
