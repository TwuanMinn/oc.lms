import { auth } from "../lib/auth";

async function main() {
  const result = await auth.api.signUpEmail({
    body: {
      email: "test.auth2@gmail.com",
      password: "Admin123!",
      name: "Test Auth User"
    }
  });
  console.log(result);
}

main().catch(console.error);
