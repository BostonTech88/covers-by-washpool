import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFileSync } from "node:fs";

test("production HTML, SEO, internal links, images and retired email endpoint", async () => {
  const child = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "-H",
      "127.0.0.1",
      "-p",
      "3135",
    ],
    { stdio: "ignore" },
  );
  const base = "http://127.0.0.1:3135";
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      try {
        await fetch(base);
        ready = true;
        break;
      } catch {
        await new Promise((r) => setTimeout(r, 100));
      }
    }
    assert.ok(ready, "Local production server started");
    const res = await fetch(base);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
    assert.match(html, /<html lang="es-MX"/);
    assert.match(
      html,
      /<link rel="canonical" href="https:\/\/www.coversbywashpool.com\/?"/,
    );
    assert.match(html, /property="og:image"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    const json = html.match(
      /<script type="application\/ld\+json">(.*?)<\/script>/s,
    );
    assert.ok(json);
    const data = JSON.parse(json[1]);
    assert.equal(data["@graph"][0]["@type"], "Organization");
    assert.equal(data["@graph"][1]["@type"], "Product");
    assert.equal(
      data["@graph"][1].offers,
      undefined,
      "No invented fixed full-cover price",
    );
    assert.ok(html.includes("¿Cuánto cuesta una cubierta térmica a medida?"));
    assert.ok(
      html.includes("El precio base es de $121 MXN por metro cuadrado."),
    );
    assert.ok(
      html.includes("chat.visitoai.com/widget/webchat.js"),
      "Existing widget retained",
    );
    for (const [, id] of html.matchAll(/href="#([^"]+)"/g))
      assert.ok(html.includes(`id="${id}"`), `Anchor ${id} exists`);
    const links = [...html.matchAll(/href="(https:\/\/wa\.me\/[^" ]+)"/g)].map(
      (x) => x[1].replaceAll("&amp;", "&"),
    );
    assert.ok(links.length >= 6);
    for (const url of links)
      assert.equal(new URL(url).pathname, "/525548919773");
    for (const path of ["/sitemap.xml", "/robots.txt"]) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200);
      assert.match(await response.text(), /https:\/\/www.coversbywashpool.com/);
    }
    for (const method of ["GET", "POST"])
      assert.equal((await fetch(base + "/api/quote", { method })).status, 404);
    const photoFiles = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url)),
    ).dependencies;
    assert.equal(photoFiles.resend, undefined);
    const srcs = new Set(
      [...html.matchAll(/src="([^\"]+)"/g)]
        .map((x) => x[1].replaceAll("&amp;", "&"))
        .filter((x) => x.startsWith("/_next/image")),
    );
    assert.ok(srcs.size >= 8);
    for (const src of srcs) {
      const image = await fetch(base + src);
      assert.equal(image.status, 200, src);
      assert.match(image.headers.get("content-type"), /^image\//);
    }
  } finally {
    child.kill("SIGTERM");
    if (child.exitCode === null) await once(child, "exit");
  }
});
