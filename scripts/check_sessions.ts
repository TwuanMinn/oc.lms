import postgres from "postgres";

const sql = postgres("postgresql://postgres:LMSdev2026!!!@db.cngwpntklbfpbqyxttox.supabase.co:5432/postgres");

async function main() {
  const users = await sql`SELECT email, password_hash FROM users WHERE email = 'student@lms.dev'`;
  console.log("User:", users[0]);
  
  const accounts = await sql`SELECT password FROM accounts WHERE provider_id = 'credential' AND user_id = (SELECT id FROM users WHERE email = 'student@lms.dev')`;
  console.log("Account:", accounts[0]);
  
  await sql.end();
}

main().catch(console.error);
