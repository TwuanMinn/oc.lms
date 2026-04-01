import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "@/server/trpc";
import * as billingService from "@/server/services/billing.service";

export const billingRouter = router({
  plans: publicProcedure.query(async () => {
    return billingService.getActivePlans();
  }),

  mySubscription: protectedProcedure.query(async ({ ctx }) => {
    return billingService.getActiveSubscription(ctx.user.id);
  }),

  subscribe: protectedProcedure
    .input(z.object({ planId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return billingService.subscribe(ctx.user.id, input.planId);
    }),

  cancel: protectedProcedure
    .mutation(async ({ ctx }) => {
      return billingService.cancelSubscription(ctx.user.id);
    }),
});
