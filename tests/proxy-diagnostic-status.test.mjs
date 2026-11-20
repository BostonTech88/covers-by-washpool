import assert from "node:assert/strict";
import test from "node:test";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../app/api/internal/proxy-diagnostic/route.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
let instance = 0;
const freshRoute = () => import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}#${instance++}`);
const secret = randomBytes(32).toString("hex");
const privateMarker = randomBytes(16).toString("hex");
const deadline = Date.UTC(2026, 10, 27, 22);
const request = (authorization) => new Request("https://www.coversbywashpool.com/api/internal/proxy-diagnostic", {
  headers: { ...(authorization === undefined ? {} : { authorization }),
    host: "www.coversbywashpool.com", "x-forwarded-host": "probe.invalid",
    cookie: `session=${privateMarker}`, "x-api-key": privateMarker, "x-forwarded-for": "192.0.2.123" },
});

test("temporary private status instrumentation", async (t) => {
  const saved = [process.env.ENABLE_PROXY_DIAGNOSTIC, process.env.PROXY_DIAGNOSTIC_SECRET];
  let wall = deadline - 60_000;
  let monotonic = 0;
  const lines = [];
  t.mock.method(Date, "now", () => wall);
  t.mock.method(performance, "now", () => monotonic);
  t.mock.method(console, "info", (...args) => {
    assert.equal(args.length, 1);
    lines.push(args[0]);
  });
  try {
    await t.test("only allowed fixed states; never fabricated mismatch without a usable secret", async () => {
      const cases = [
        [undefined, undefined, undefined, { flag: "missing", secret: "missing", authorization: "absent" }],
        ["TRUE", "short", "Basic ignored", { flag: "invalid", secret: "invalid", authorization: "invalid_scheme" }],
        ["true", "", "Bearer ignored", { flag: "enabled", secret: "missing" }],
        ["true", "short", "Bearer ignored", { flag: "enabled", secret: "invalid" }],
        ["true", secret, undefined, { flag: "enabled", secret: "valid", authorization: "absent" }],
        ["true", secret, "", { flag: "enabled", secret: "valid", authorization: "invalid_scheme" }],
        ["true", secret, `bearer ${secret}`, { flag: "enabled", secret: "valid", authorization: "invalid_scheme" }],
        ["true", secret, "Bearer wrong", { flag: "enabled", secret: "valid", authorization: "mismatch" }],
        ["true", secret, `Bearer ${secret}`, { flag: "enabled", secret: "valid", authorization: "match" }],
        ["false", secret, `Bearer ${secret}`, { flag: "invalid", secret: "valid", authorization: "match" }],
      ];
      for (const [flag, value, auth, expected] of cases) {
        if (flag === undefined) delete process.env.ENABLE_PROXY_DIAGNOSTIC; else process.env.ENABLE_PROXY_DIAGNOSTIC = flag;
        if (value === undefined) delete process.env.PROXY_DIAGNOSTIC_SECRET; else process.env.PROXY_DIAGNOSTIC_SECRET = value;
        const route = await freshRoute();
        const res = route.GET(request(auth));
        assert.deepEqual(JSON.parse(lines.at(-1)), expected);
        assert.match(res.headers.get("cache-control"), /no-store/);
        const success = expected.flag === "enabled" && expected.authorization === "match";
        assert.equal(res.status, success ? 200 : 404);
        if (!success) assert.equal(await res.text(), "");
      }
      const output = lines.join("\n");
      for (const sensitive of [secret, privateMarker, "192.0.2.123", "probe.invalid", "www.coversbywashpool.com", "Bearer", "Basic"]) {
        assert.equal(output.includes(sensitive), false, "Logs must contain only approved enumerations");
      }
    });
    process.env.ENABLE_PROXY_DIAGNOSTIC = "true";
    process.env.PROXY_DIAGNOSTIC_SECRET = secret;
    await t.test("20 events maximum per instance, authentication continues afterward", async () => {
      const route = await freshRoute(); const before = lines.length;
      for (let i = 0; i < 25; i++) assert.equal(route.GET(request(`Bearer ${secret}`)).status, 200);
      assert.equal(lines.length - before, 20);
    });
    await t.test("15 minute monotonic window ends without disabling endpoint", async () => {
      const route = await freshRoute(); const before = lines.length;
      monotonic = 1000;
      route.GET(request());
      monotonic += 15 * 60 * 1000 - 1;
      route.GET(request());
      monotonic += 1;
      assert.equal(route.GET(request(`Bearer ${secret}`)).status, 200);
      assert.equal(lines.length - before, 2);
    });
    await t.test("absolute deadline survives a fresh process/module instance", async () => {
      wall = deadline;
      for (let i = 0; i < 2; i++) {
        const route = await freshRoute(); const before = lines.length;
        assert.equal(route.GET(request(`Bearer ${secret}`)).status, 200);
        assert.equal(lines.length, before);
      }
      wall = deadline - 60_000;
    });
    await t.test("unsupported methods never emit events", async () => {
      const route = await freshRoute(); const before = lines.length;
      for (const method of ["HEAD", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"]) assert.equal(route[method]().status, 404);
      assert.equal(lines.length, before);
    });
    await t.test("logging failure cannot change authentication or public response", async () => {
      t.mock.method(console, "info", () => { throw new Error("test sink unavailable"); });
      const route = await freshRoute();
      assert.equal(route.GET(request()).status, 404);
      assert.equal(route.GET(request(`Bearer ${secret}`)).status, 200);
    });
  } finally {
    for (const [name, value] of [["ENABLE_PROXY_DIAGNOSTIC", saved[0]], ["PROXY_DIAGNOSTIC_SECRET", saved[1]]]) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
  }
});
