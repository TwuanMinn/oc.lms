import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "@/server/trpc";
import * as certificateService from "@/server/services/certificate.service";

export const certificateRouter = router({
  issue: protectedProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      return certificateService.issueCertificate(ctx.user.id, input.courseId);
    }),

  myCertificates: protectedProcedure.query(async ({ ctx }) => {
    return certificateService.getUserCertificates(ctx.user.id);
  }),

  count: protectedProcedure.query(async ({ ctx }) => {
    return certificateService.getCertificateCount(ctx.user.id);
  }),

  verify: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      return certificateService.getCertificateById(input.id);
    }),

  streakData: protectedProcedure.query(async ({ ctx }) => {
    return certificateService.getStreakData(ctx.user.id);
  }),
});
