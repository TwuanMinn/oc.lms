import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";
import * as searchService from "@/server/services/search.service";

// #12: Delegated to search.service — consistent with project architecture
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
      return searchService.searchCourses(input);
    }),
});
