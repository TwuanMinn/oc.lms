import "dotenv/config";
import { writeFileSync } from "fs";

const BASE_URL = "http://localhost:3000";

async function testLogin() {
  let output = "Testing sign-in API...\n\n";
  
  try {
    const res = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": BASE_URL,
        "Referer": `${BASE_URL}/`,
      },
      body: JSON.stringify({
        email: "admin@lms.dev",
        password: "Admin123!",
      }),
    });

    output += `Status: ${res.status}\n`;
    output += `Status Text: ${res.statusText}\n\n`;
    
    const body = await res.text();
    output += `Body:\n${body}\n`;
  } catch (err: any) {
    output += `Fetch error: ${err.message}\n${err.stack}\n`;
  }

  writeFileSync("login-test-output.txt", output);
  console.log("Written to login-test-output.txt");
}

testLogin();
