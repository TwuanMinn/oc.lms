import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    "postgresql://postgres:LMSdev2026!!!@db.cngwpntklbfpbqyxtox.supabase.co:5432/postgres",
});

const result = await pool.query(
  "UPDATE users SET plain_text_password = 'Admin123!' WHERE deleted_at IS NULL"
);
console.log("✅ Updated rows:", result.rowCount);
await pool.end();
