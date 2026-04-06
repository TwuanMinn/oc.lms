import { router, protectedProcedure } from "@/server/trpc";
import { z } from "zod";
import * as notificationService from "@/server/services/notification.service";

// #10: Added getAll, delete endpoints + pagination for getUnread
export const notificationRouter = router({
  getUnread: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).default(20),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return notificationService.getUnreadNotifications(
        ctx.user.id,
        input?.limit ?? 20,
        input?.offset ?? 0
      );
    }),

  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    return notificationService.getUnreadCount(ctx.user.id);
  }),

  getAll: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).default(20),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return notificationService.getAllNotifications(
        ctx.user.id,
        input?.limit ?? 20,
        input?.offset ?? 0
      );
    }),

  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    return notificationService.markAllRead(ctx.user.id);
  }),

  markRead: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      return notificationService.markRead(input.id, ctx.user.id);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      return notificationService.deleteNotification(input.id, ctx.user.id);
    }),
});
