import { router, protectedProcedure } from "@/server/trpc";
import { z } from "zod";
import * as notificationService from "@/server/services/notification.service";

export const notificationRouter = router({
  getUnread: protectedProcedure.query(async ({ ctx }) => {
    return notificationService.getUnreadNotifications(ctx.user.id);
  }),

  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    return notificationService.getUnreadCount(ctx.user.id);
  }),

  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    return notificationService.markAllRead(ctx.user.id);
  }),

  markRead: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return notificationService.markRead(input.id);
    }),
});
