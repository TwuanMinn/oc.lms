import "server-only";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import type { DB } from "@/server/db";
import { headers } from "next/headers";

// A2: Strongly-typed user with role field
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  image?: string | null;
  [key: string]: unknown;
};

export type Context = {
  session: Awaited<ReturnType<typeof auth.api.getSession>> | null;
  db: DB;
};

export type ProtectedContext = Context & {
  session: NonNullable<Context["session"]>;
  user: AuthUser;
};

export async function createContext(): Promise<Context> {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  return {
    session,
    db,
  };
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    // #9: Don't leak internal details in production
    if (
      process.env.NODE_ENV === "production" &&
      error.code === "INTERNAL_SERVER_ERROR"
    ) {
      console.error("[tRPC Error]", error.message, error.cause);
      return { ...shape, message: "Something went wrong" };
    }
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.session.user as AuthUser,
    },
  });
});

// #20: Chain from protectedProcedure — single source of truth for auth
export const teacherProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "TEACHER" && ctx.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Teacher access required" });
  }
  return next({ ctx });
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
