import "dotenv/config";

async function check() {
  const baseUrl = "http://localhost:3000";
  
  for (const email of ["admin@lms.dev", "teacher@lms.dev", "student@lms.dev"]) {
    try {
      const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Origin": "http://localhost:3000",
        },
        body: JSON.stringify({ email, password: "Admin123!" }),
      });
      const text = await res.text();
      let parsed: string;
      try {
        const json = JSON.parse(text);
        parsed = json.user ? `OK (role=${json.user.role})` : (json.message ?? text.substring(0, 100));
      } catch {
        parsed = text.substring(0, 120);
      }
      console.log(`${email}: ${res.status} → ${parsed}`);
    } catch (e: any) {
      console.log(`${email}: ERROR → ${e.message}`);
    }
  }
}

check().catch(console.error);
