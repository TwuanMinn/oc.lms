import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection URL"),
  BETTER_AUTH_SECRET: z.string().min(16, "BETTER_AUTH_SECRET must be at least 16 characters"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const formatted = Object.entries(errors)
      .map(([key, msgs]) => `  ❌ ${key}: ${msgs?.join(", ")}`)
      .join("\n");

    console.error("\n🚨 Invalid environment variables:\n" + formatted + "\n");
    throw new Error("Missing or invalid environment variables. See above for details.");
  }

  return parsed.data;
}

export const env = validateEnv();
