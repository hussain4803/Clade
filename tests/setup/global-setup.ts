import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";

/** Builds a fresh, seeded SQLite database (prisma/test.db) for the Vitest run. */
export default function setup() {
  const root = path.resolve(__dirname, "../..");
  const env = { ...process.env, DATABASE_URL: "file:./test.db" };
  for (const f of ["test.db", "test.db-journal"]) rmSync(path.join(root, "prisma", f), { force: true });
  execSync("npx prisma migrate deploy", { cwd: root, env, stdio: "pipe" });
  execSync("npx tsx prisma/seed.ts", { cwd: root, env, stdio: "pipe" });
}
