import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../server/db";
import * as usersSchema from "../server/db/schema/users";

export const testAuth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: {
      users: usersSchema.users,
      sessions: usersSchema.sessions,
      accounts: usersSchema.accounts,
      verifications: usersSchema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
});
