#!/usr/bin/env node
/**
 * Hits every API route on a running server and checks status codes + JSON shape.
 *   npm run smoke                       (defaults to http://localhost:3000)
 *   BASE_URL=http://localhost:3100 npm run smoke
 * Note: creates one newsletter subscription and one contact submission per run.
 */
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const stamp = Date.now();

const checks = [
  ["GET", "/api/health", 200],
  ["GET", "/api/races", 200],
  ["GET", "/api/races?series=WEC&status=upcoming&sort=date_desc", 200],
  ["GET", "/api/races?season=2027&from=2027-06-01&to=2027-06-30", 200],
  ["GET", "/api/races?series=F1", 400],
  ["GET", "/api/races/le-mans-2026", 200],
  ["GET", "/api/races/unknown-race", 404],
  ["GET", "/api/news", 200],
  ["GET", "/api/news?q=le%20mans&category=race-report&page=1&pageSize=3", 200],
  ["GET", "/api/news?category=nope", 400],
  ["GET", "/api/news/inside-the-hybrid-system", 200],
  ["GET", "/api/news/unknown-article", 404],
  ["GET", "/api/drivers", 200],
  ["GET", "/api/drivers?car=18", 200],
  ["POST", "/api/newsletter", 201, { email: `smoke-${stamp}@example.com`, source: "smoke" }],
  ["POST", "/api/newsletter", 200, { email: `SMOKE-${stamp}@example.com` }],
  ["POST", "/api/newsletter", 400, { email: "invalid" }],
  ["POST", "/api/contact", 201, { name: "Smoke Test", email: "smoke@example.com", topic: "general", subject: "Smoke test", message: "Automated smoke test message for the contact endpoint." }],
  ["POST", "/api/contact", 400, { name: "", email: "x", topic: "general", subject: "", message: "" }],
  ["POST", "/api/contact", 400, "{bad json"],
];

let failed = 0;
for (const [method, path, expected, body] of checks) {
  const started = performance.now();
  let status = 0;
  let note = "";
  try {
    const res = await fetch(BASE + path, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
    });
    status = res.status;
    const json = await res.json();
    if (typeof json.success !== "boolean") note = "missing `success`";
    else if (json.success && !("data" in json)) note = "missing `data`";
    else if (!json.success && !json.error?.code) note = "missing `error.code`";
    else note = json.success ? (Array.isArray(json.data) ? `${json.data.length} items` : json.message ?? "ok") : json.error.code;
  } catch (err) {
    note = `request failed: ${err.message}`;
  }
  const ok = status === expected && !note.startsWith("missing") && !note.startsWith("request failed");
  if (!ok) failed++;
  const ms = Math.round(performance.now() - started);
  console.log(`${ok ? "✓" : "✗"} ${method.padEnd(4)} ${path.padEnd(62)} ${String(status).padEnd(4)} (want ${expected}) ${String(ms).padStart(4)}ms  ${note}`);
}

console.log(failed ? `\n${failed} check(s) failed against ${BASE}` : `\nAll ${checks.length} API checks passed against ${BASE}`);
process.exit(failed ? 1 : 0);
