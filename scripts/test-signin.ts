import { auth } from "../lib/auth";
import "dotenv/config";

async function testSignIn() {
  const result = await auth.api.signInEmail({
    body: {
      email: "admin@lms.dev",
      password: "Admin123!",
    }
  });
  console.log(result);
}

testSignIn().catch(console.error);
