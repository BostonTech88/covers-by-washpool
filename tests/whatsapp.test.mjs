import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

async function load(source) {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext },
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
}
const source = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const { buildWhatsAppUrl, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } = await load(
  source("../lib/whatsapp.ts"),
);
const { buildSecurityQuoteMessage } = await load(
  source("../lib/whatsapp-quote.ts"),
);
const analytics = await load(source("../lib/analytics.ts"));

test("one destination, optional message and lossless encoding of customer text", () => {
  const message = "José & Ana + familia\n8 × 4 m # alberca? 100% 🏊";
  const url = new URL(buildWhatsAppUrl(message));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/" + WHATSAPP_NUMBER);
  assert.equal(WHATSAPP_NUMBER, "525548919773");
  assert.equal(WHATSAPP_DISPLAY, "+" + WHATSAPP_NUMBER);
  assert.equal(url.searchParams.get("text"), message);
  assert.equal([...url.searchParams].length, 1);
  assert.equal(buildWhatsAppUrl(), "https://wa.me/" + WHATSAPP_NUMBER);
});

test("security quote preserves every commercial field and describes manual attachments", () => {
  const message = buildSecurityQuoteMessage({
    nombre: " Ana Pérez ",
    telefono: "+52 55 1234 5678",
    ciudad: "Mérida",
    medidas: "8 × 4 m; escalera lateral",
    observaciones: "Árbol cerca\nRevisar anclajes & acabado",
  });
  for (const text of [
    "Tipo de cubierta: Seguridad",
    "Nombre: Ana Pérez",
    "Teléfono: +52 55 1234 5678",
    "Ciudad: Mérida",
    "8 × 4 m; escalera lateral",
    "Árbol cerca\nRevisar anclajes & acabado",
    "adjuntaré manualmente",
  ])
    assert.ok(message.includes(text));
  assert.equal(
    new URL(buildWhatsAppUrl(message)).searchParams.get("text"),
    message,
  );
  assert.ok(
    buildSecurityQuoteMessage({
      nombre: "A",
      telefono: "1",
      ciudad: "B",
      medidas: "por confirmar",
      observaciones: "  ",
    }).includes("Sin observaciones"),
  );
});

test("click analytics never claim a received lead, send contact data or trigger Ads conversion", () => {
  const calls = [];
  globalThis.window = {
    gtag: (...a) => calls.push(a),
    fbq: (...a) => calls.push(a),
    gtag_report_conversion: () => assert.fail("No verified conversion"),
  };
  try {
    analytics.trackWhatsAppClick("seguridad", "cta_seguridad");
    assert.deepEqual(calls, [
      [
        "event",
        "whatsapp_click",
        { product_type: "seguridad", source: "cta_seguridad" },
      ],
      [
        "trackCustom",
        "WhatsAppClick",
        { content_category: "seguridad", content_name: "cta_seguridad" },
      ],
    ]);
    window.gtag = () => {
      throw new Error("blocked analytics");
    };
    window.fbq = () => {
      throw new Error("blocked analytics");
    };
    assert.doesNotThrow(() =>
      analytics.trackWhatsAppClick("general", "floating_button"),
    );
  } finally {
    delete globalThis.window;
  }
  assert.doesNotThrow(() =>
    analytics.trackWhatsAppClick("general", "floating_button"),
  );
});

const { calcArea, buildThermalMessage, PRICE_PER_M2 } = await load(
  source("../lib/calculator.ts"),
);

test("thermal rectangle, circle, L shape, irregular and invalid dimensions retain calculations", () => {
  assert.equal(calcArea("rectangular", { largo: "8", ancho: "4" }), 32);
  assert.equal(calcArea("circular", { diametro: "4" }), Math.PI * 4);
  assert.equal(
    calcArea("l-shape", {
      largo1: "6",
      ancho1: "3",
      largo2: "4",
      ancho2: "2.5",
    }),
    28,
  );
  assert.equal(calcArea("irregular", {}), null);
  assert.equal(calcArea("rectangular", { largo: "0", ancho: "4" }), null);
});

test("thermal WhatsApp retains price of 121 per square meter, dimensions and no location fields", () => {
  const message = buildThermalMessage(
    "rectangular",
    { largo: "8", ancho: "4" },
    32,
  );
  assert.ok(message.includes("$3,872 MXN"));
  assert.ok(message.includes("8m × 4m"));
  assert.equal(PRICE_PER_M2, 121);
  assert.ok(!/Ciudad|Postal/.test(message));
  assert.equal(
    new URL(buildWhatsAppUrl(message)).searchParams.get("text"),
    message,
  );
  assert.ok(
    buildThermalMessage("irregular", {}, null).includes(
      "manualmente en WhatsApp",
    ),
  );
});

test("invalid or overflowing measurements never produce a quote", () => {
  for (const value of ["-2", "0", "Infinity", "NaN", "1e309", "8oops", ""]) {
    assert.equal(calcArea("rectangular", { largo: value, ancho: "4" }), null);
    assert.equal(
      calcArea("l-shape", {
        largo1: value,
        ancho1: "3",
        largo2: "2",
        ancho2: "2",
      }),
      null,
    );
  }
  assert.equal(
    calcArea("rectangular", { largo: "1e200", ancho: "1e200" }),
    null,
  );
});
