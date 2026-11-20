import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";
import http from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";

// Load the real config using the project's existing TypeScript dependency.
const source = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const { default: config } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const previous = process.env.ENABLE_WWW_HOST_REDIRECT;

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3119"], { stdio: ["ignore", "pipe", "pipe"] });
let output = "";
server.stdout.on("data", (data) => { output += data; });
server.stderr.on("data", (data) => { output += data; });

async function response(url, headers = {}, method = "GET") {
  const target = new URL(url);
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port: 3119,
      path: target.pathname + target.search, method,
      headers: { ...headers, host: target.host },
    }, (res) => {
      res.resume();
      resolve({ status: res.statusCode, headers: new Headers(res.headers) });
    });
    req.on("error", reject);
    req.end();
  });
}

test("www redirect policy", async (t) => {
  try {
    for (let i = 0; !output.includes("Ready") && i < 100; i++) {
      if (server.exitCode !== null) throw new Error(output);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.match(output, /Ready/);
    await t.test("disabled unless explicitly enabled, including ambiguous proxy hosts", async () => {
      for (const value of [undefined, "false", "1"]) {
        if (value === undefined) delete process.env.ENABLE_WWW_HOST_REDIRECT;
        else process.env.ENABLE_WWW_HOST_REDIRECT = value;
        assert.deepEqual(await config.redirects(), []);
      }
    });
    process.env.ENABLE_WWW_HOST_REDIRECT = "true";
    await t.test("308 preserves paths and query values; destination does not redirect again", async () => {
      for (const path of ["/", "/robots.txt", "/sitemap.xml", "/api/quote", "/catalogo/cubiertas?utm_source=google&tag=a&tag=b&empty=&next=%2Fcotizar%3Fa%3D1", "/cubierta%20termica?q=M%C3%A9xico"]) {
        const original = new URL(`https://coversbywashpool.com${path}`);
        const r = await response(original.href);
        assert.equal(r.status, 308, path);
        const target = new URL(r.headers.get("location"));
        assert.equal(target.origin, "https://www.coversbywashpool.com");
        assert.equal(target.pathname, original.pathname);
        assert.deepEqual([...target.searchParams], [...original.searchParams]);
        const second = await response(target.href);
        assert.equal(second.headers.get("location"), null);
      }
    });
    await t.test("POST is redirected with 308 before the quote integration runs", async () => {
      const r = await response("https://coversbywashpool.com/api/quote?source=test", {}, "POST");
      assert.equal(r.status, 308);
      assert.equal(r.headers.get("location"), "https://www.coversbywashpool.com/api/quote?source=test");
    });
    await t.test("www, localhost, preview and lookalike hosts never match", async () => {
      for (const host of ["www.coversbywashpool.com", "localhost:3002", "preview.example.com", "coversbywashpoolXcom", "coversbywashpool.com.evil.example"]) {
        const r = await response(`https://${host}/?q=1`, { "x-forwarded-host": "coversbywashpool.com" });
        assert.equal(r.headers.get("location"), null);
      }
    });
    await t.test("forwarded headers cannot choose the destination or trigger www loops", async () => {
      for (const forwarded of ["coversbywashpool.com", "www.coversbywashpool.com", "evil.example", "coversbywashpool.com, evil.example"]) {
        for (const proto of ["http", "https"]) {
          const headers = { "x-forwarded-host": forwarded, "x-forwarded-proto": proto };
          const r = await response("https://coversbywashpool.com/test?x=1", headers);
          assert.equal(r.headers.get("location"), "https://www.coversbywashpool.com/test?x=1");
          const canonical = await response("https://www.coversbywashpool.com/test?x=1", headers);
          assert.equal(canonical.headers.get("location"), null);
        }
      }
    });
  } finally {
    if (server.exitCode === null && server.signalCode === null) {
      const exited = once(server, "exit");
      server.kill("SIGTERM");
      await exited;
    }
    if (previous === undefined) delete process.env.ENABLE_WWW_HOST_REDIRECT;
    else process.env.ENABLE_WWW_HOST_REDIRECT = previous;
  }
});
