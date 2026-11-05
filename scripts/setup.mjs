#!/usr/bin/env node
/**
 * One-step local setup: creates .env (if missing), applies migrations, seeds sample data.
 *   npm run setup
 */
import { execSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";

const run = (cmd) => {
  console.log(`\n› ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
};

if (!existsSync(".env")) {
  copyFileSync(".env.example", ".env");
  console.log("Created .env from .env.example");
}

run("npx prisma migrate deploy");
run("npx prisma generate");
run("npx tsx prisma/seed.ts");
console.log("\nSetup complete. Start the site with: npm run dev → http://localhost:3000");
