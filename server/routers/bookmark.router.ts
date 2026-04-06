import { z } from "zod";
import { router, protectedProcedure } from "@/server/trpc";
import * as bookmarkService from "@/server/services/bookmark.service";

export const bookmarkRouter = router({
  toggle: protectedProcedure
    .input(z.object({ lessonId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      return bookmarkService.toggleBookmark(ctx.user.id, input.lessonId);
    }),

  isBookmarked: protectedProcedure
    .input(z.object({ lessonId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      return bookmarkService.isBookmarked(ctx.user.id, input.lessonId);
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return bookmarkService.getUserBookmarks(ctx.user.id);
  }),
});
