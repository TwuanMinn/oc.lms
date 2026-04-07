const postgres = require("./node_modules/postgres/cjs/src/index.js");

const sql = postgres(
  "postgresql://postgres:LMSdev2026!!!@db.cngwpntklbfpbqyxtox.supabase.co:5432/postgres"
);

async function run() {
  const result = await sql`
    UPDATE users 
    SET plain_text_password = 'Admin123!' 
    WHERE deleted_at IS NULL
  `;
  console.log("✅ Updated rows:", result.count);
  await sql.end();
}

run().catch((e) => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});
