import assert from "node:assert/strict";
import test from "node:test";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { once } from "node:events";
import http from "node:http";

const secret = randomBytes(32).toString("hex");
const marker = randomBytes(16).toString("hex");
const port = 3121;
async function call(headers = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port,
      path: "/api/internal/proxy-diagnostic", method, headers,
    }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on("error", reject);
    req.end();
  });
}
function uncached(r) {
  assert.match(r.headers["cache-control"], /no-store/);
  assert.equal(r.headers["cdn-cache-control"], "no-store");
  assert.equal(r.headers["surrogate-control"], "no-store");
  assert.match(r.headers.vary, /Authorization/i);
  assert.match(r.headers["x-robots-tag"], /noindex/);
}
async function withServer(settings, check) {
  const env = { ...process.env, ENABLE_PROXY_DIAGNOSTIC: "", PROXY_DIAGNOSTIC_SECRET: "", ...settings };
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], { env, stdio: ["ignore", "pipe", "pipe"] });
  let logs = "";
  child.stdout.on("data", (chunk) => { logs += chunk; });
  child.stderr.on("data", (chunk) => { logs += chunk; });
  try {
    for (let i = 0; !logs.includes("Ready") && i < 100; i++) {
      assert.equal(child.exitCode, null, "Local server stopped before readiness");
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.ok(logs.includes("Ready"), "Local server must become ready");
    await check();
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      const exit = once(child, "exit"); child.kill("SIGTERM"); await exit;
    }
    assert.equal(logs.includes(secret), false, "Credentials must not appear in logs");
    assert.equal(logs.includes(marker), false, "Private headers must not appear in logs");
  }
}

test("production HTTP authentication and cache isolation", async (t) => {
  for (const [label, settings] of [
    ["default disabled", {}],
    ["enabled without secret", { ENABLE_PROXY_DIAGNOSTIC: "true" }],
    ["enabled with short secret", { ENABLE_PROXY_DIAGNOSTIC: "true", PROXY_DIAGNOSTIC_SECRET: "short" }],
  ]) {
    await t.test(label, () => withServer(settings, async () => {
      const r = await call({ authorization: "Bearer short" });
      assert.equal(r.status, 404); assert.equal(r.body, ""); uncached(r);
    }));
  }
  await t.test("authorized output never leaks to subsequent anonymous requests", () => withServer({ ENABLE_PROXY_DIAGNOSTIC: "true", PROXY_DIAGNOSTIC_SECRET: secret }, async () => {
    for (const host of ["coversbywashpool.com", "www.coversbywashpool.com"]) {
      for (const forwarded of [undefined, "probe.invalid", "probe.invalid, coversbywashpool.com"]) {
        const headers = { host, authorization: `Bearer ${secret}`, cookie: `session=${marker}`, "x-api-key": marker };
        if (forwarded !== undefined) headers["x-forwarded-host"] = forwarded;
        const r = await call(headers);
        assert.equal(r.status, 200); uncached(r);
        // Next fills a missing forwarded host from Host before the route runs.
        assert.deepEqual(JSON.parse(r.body), { Host: host, "X-Forwarded-Host": forwarded ?? host });
        for (const authorization of [undefined, "Bearer invalid"]) {
          const anonymous = await call({ host, ...(authorization ? { authorization } : {}) });
          assert.equal(anonymous.status, 404); assert.equal(anonymous.body, ""); uncached(anonymous);
        }
      }
    }
    for (const method of ["HEAD", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"]) {
      const r = await call({ authorization: `Bearer ${secret}` }, method);
      assert.equal(r.status, 404); assert.equal(r.body, ""); uncached(r);
    }
  }));
});
