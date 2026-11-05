import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "tests/api/**/*.test.ts"],
    globalSetup: ["tests/setup/global-setup.ts"],
    env: {
      DATABASE_URL: "file:./test.db",
      RATE_LIMIT_DISABLED: "true",
    },
    // API tests share one SQLite file; run files sequentially to avoid lock contention.
    fileParallelism: false,
    testTimeout: 15000,
  },
});
