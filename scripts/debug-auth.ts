import "dotenv/config";
import { writeFileSync } from "fs";
import postgres from "postgres";

async function testAuth() {
  let output = "";

  try {
    const { betterAuth } = await import("better-auth");
    const { drizzleAdapter } = await import("better-auth/adapters/drizzle");
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const usersSchema = await import("../server/db/schema/users");

    const client = postgres(process.env.DATABASE_URL!, { prepare: false });
    const db = drizzle(client, { schema: { ...usersSchema } });

    // Intercept DB operations
    const originalInsert = db.insert.bind(db);
    const patchedDb = new Proxy(db, {
      get(target, prop) {
        if (prop === 'insert') {
          return (...args: any[]) => {
            output += `  DB.insert called on table\n`;
            const builder = originalInsert(...args);
            const originalValues = builder.values.bind(builder);
            builder.values = (...vArgs: any[]) => {
              output += `  .values(${JSON.stringify(vArgs[0])?.substring(0, 300)})\n`;
              return originalValues(...vArgs);
            };
            return builder;
          };
        }
        return (target as any)[prop];
      }
    });

    const auth = betterAuth({
      database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
        debugLogs: true,
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
      session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
      },
      user: {
        fields: {
          image: "avatar",
        },
        additionalFields: {
          role: {
            type: "string",
            defaultValue: "STUDENT",
            input: false,
          },
        },
      },
    });

    // Capture console output
    const origLog = console.log;
    const origError = console.error;
    const origWarn = console.warn;
    const logs: string[] = [];
    console.log = (...args: any[]) => logs.push(`LOG: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`);
    console.error = (...args: any[]) => logs.push(`ERR: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`);
    console.warn = (...args: any[]) => logs.push(`WARN: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`);

    const req = new Request("http://localhost:3000/api/auth/sign-in/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:3000",
      },
      body: JSON.stringify({
        email: "admin@lms.dev",
        password: "Admin123!",
      }),
    });

    output += "=== Calling auth.handler ===\n";
    const response = await auth.handler(req);
    
    // Restore
    console.log = origLog;
    console.error = origError;
    console.warn = origWarn;

    output += `Status: ${response.status}\n`;
    const text = await response.text();
    output += `Body: ${text}\n\n`;

    output += "=== Captured logs ===\n";
    for (const l of logs) {
      output += `  ${l.substring(0, 500)}\n`;
    }

    await client.end();
  } catch (err: any) {
    output += `ERROR: ${err.message}\n${err.stack}\n`;
  }

  writeFileSync("debug-auth-output.txt", output);
  process.stdout.write(output);
}

testAuth();
