import assert from "node:assert/strict";
import test from "node:test";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../app/api/internal/proxy-diagnostic/route.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const route = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const secret = randomBytes(32).toString("hex");
function request(headers = {}, query = "") {
  return new Request(`https://www.coversbywashpool.com/api/internal/proxy-diagnostic${query}`, { headers });
}
function privateResponse(response) {
  assert.match(response.headers.get("cache-control"), /private.*no-store/);
  assert.equal(response.headers.get("cdn-cache-control"), "no-store");
  assert.equal(response.headers.get("surrogate-control"), "no-store");
  assert.equal(response.headers.get("vary"), "Authorization");
  assert.match(response.headers.get("x-robots-tag"), /noindex/);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
}
async function denied(response) {
  assert.equal(response.status, 404);
  assert.equal(await response.text(), "");
  privateResponse(response);
}

test("diagnostic authentication and privacy", async (t) => {
  const saved = { enabled: process.env.ENABLE_PROXY_DIAGNOSTIC, secret: process.env.PROXY_DIAGNOSTIC_SECRET };
  try {
    await t.test("disabled without explicit enable flag", async () => {
      process.env.PROXY_DIAGNOSTIC_SECRET = secret;
      for (const flag of [undefined, "false", "1"]) {
        if (flag === undefined) delete process.env.ENABLE_PROXY_DIAGNOSTIC;
        else process.env.ENABLE_PROXY_DIAGNOSTIC = flag;
        await denied(route.GET(request({ authorization: `Bearer ${secret}` })));
      }
    });
    process.env.ENABLE_PROXY_DIAGNOSTIC = "true";
    await t.test("missing, short or malformed secret always disables endpoint", async () => {
      for (const candidate of [undefined, "", "a".repeat(31), randomBytes(16).toString("hex"), "x".repeat(64), secret + "a"]) {
        if (candidate === undefined) delete process.env.PROXY_DIAGNOSTIC_SECRET;
        else process.env.PROXY_DIAGNOSTIC_SECRET = candidate;
        await denied(route.GET(request({ authorization: `Bearer ${candidate ?? ""}` })));
      }
    });
    process.env.PROXY_DIAGNOSTIC_SECRET = secret;
    await t.test("rejects missing/wrong credentials and credentials in URL or cookies", async () => {
      for (const authorization of ["", `Basic ${secret}`, `Bearer ${secret.slice(1)}`, `Bearer ${randomBytes(32).toString("hex")}`, `Bearer ${secret}, Bearer ${secret}`]) {
        await denied(route.GET(request({ authorization, cookie: `token=${secret}` }, `?token=${secret}`)));
      }
    });
    await t.test("only two allowlisted headers are returned, including conflicting proxy values", async () => {
      for (const host of ["coversbywashpool.com", "www.coversbywashpool.com"]) {
        for (const forwarded of [undefined, host, "probe.invalid", "probe.invalid, coversbywashpool.com"]) {
          const headers = { host, authorization: `Bearer ${secret}`, cookie: "session=private", "x-api-key": "private", "x-forwarded-for": "192.0.2.1" };
          if (forwarded !== undefined) headers["x-forwarded-host"] = forwarded;
          const response = route.GET(request(headers));
          assert.equal(response.status, 200);
          privateResponse(response);
          assert.deepEqual(await response.json(), { Host: host, "X-Forwarded-Host": forwarded ?? null });
        }
      }
    });
    await t.test("missing diagnostic headers return only null values", async () => {
      const response = route.GET(request({ authorization: `Bearer ${secret}` }));
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { Host: null, "X-Forwarded-Host": null });
      privateResponse(response);
    });
    await t.test("unsupported methods are empty and uncacheable", async () => {
      for (const method of ["HEAD", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"]) await denied(route[method]());
    });
  } finally {
    for (const [name, value] of [["ENABLE_PROXY_DIAGNOSTIC", saved.enabled], ["PROXY_DIAGNOSTIC_SECRET", saved.secret]]) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
  }
});
