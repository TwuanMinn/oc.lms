import { testAuth } from "../lib/test-auth";
import "dotenv/config";

async function run() {
  try {
    const result = await testAuth.api.signInEmail({
      body: {
        email: "student@lms.dev",
        password: "Admin123!"
      }
    });
    console.log("Success:", result);
  } catch (error: any) {
    console.error("Sign in failed:");
    console.error(error);
  }
}

run().catch(console.error);
