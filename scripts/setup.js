#!/usr/bin/env node

/**
 * One-command project setup (Supabase Cloud Edition).
 * Usage: npm run setup
 *
 * What it does:
 *   1. Pushes Drizzle schema to the shared Supabase DB
 *   2. Seeds the database
 *
 * No Docker required — the DATABASE_URL in .env points to the
 * shared Supabase cloud database. Works on any computer.
 */

const { execSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function log(emoji, msg) {
  console.log(`\n${emoji}  ${msg}`);
}

function run(cmd, opts = {}) {
  console.log(`   → ${cmd}`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: "inherit", ...opts });
    return true;
  } catch {
    return false;
  }
}

log("🌐", "Using Supabase Shared Cloud Database (no Docker needed)");

// ── Step 1: Push schema ──
log("📦", "Pushing Drizzle schema to database...");
const pushed = run("npx drizzle-kit push");
if (!pushed) {
  log("❌", "Schema push failed");
  process.exit(1);
}
log("✅", "Schema pushed successfully");

// ── Step 2: Seed ──
log("🌱", "Seeding database...");
const seeded = run("npx tsx scripts/seed.ts");
if (!seeded) {
  log("⚠️", "Seeding failed (may already be seeded — continuing)");
} else {
  log("✅", "Database seeded");
}

// ── Done ──
log("🚀", "Setup complete! Run: npm run dev");
console.log("\n   Accounts:");
console.log("   ├─ Admin:   admin@lms.dev / Admin123!");
console.log("   ├─ Teacher: teacher@lms.dev / Admin123!");
console.log("   └─ Student: student@lms.dev / Admin123!\n");
