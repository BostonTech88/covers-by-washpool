"use client";

import { useRef, useState } from "react";
import { quoteStart, quotePriceShown, trackLead } from "@/lib/analytics";

type Shape = "rectangular" | "circular" | "l-shape" | "irregular";
type Step = "form" | "price" | "contact" | "confirm";

const PRICE_PER_M2 = 121;

const shapes: { id: Shape; label: string; icon: string }[] = [
  { id: "rectangular", label: "Rectangular", icon: "▭" },
  { id: "circular", label: "Circular", icon: "◯" },
  { id: "l-shape", label: "Forma de L", icon: "⌐" },
  { id: "irregular", label: "Irregular", icon: "✦" },
];

function calcArea(shape: Shape, dims: Record<string, string>): number | null {
  if (shape === "rectangular") {
    const l = parseFloat(dims.largo);
    const a = parseFloat(dims.ancho);
    if (!l || !a || l <= 0 || a <= 0) return null;
    return l * a;
  }
  if (shape === "circular") {
    const d = parseFloat(dims.diametro);
    if (!d || d <= 0) return null;
    return Math.PI * Math.pow(d / 2, 2);
  }
  if (shape === "l-shape") {
    const l1 = parseFloat(dims.largo1), a1 = parseFloat(dims.ancho1);
    const l2 = parseFloat(dims.largo2), a2 = parseFloat(dims.ancho2);
    if (!l1 || !a1 || !l2 || !a2) return null;
    return l1 * a1 + l2 * a2;
  }
  return null; // irregular: no auto-calc
}

function buildWhatsAppMsg(
  shape: Shape,
  dims: Record<string, string>,
  price: number | null,
  ciudad: string,
  cp: string
): string {
  let medidas = "";
  if (shape === "rectangular") medidas = `${dims.largo}m × ${dims.ancho}m`;
  else if (shape === "circular") medidas = `Diámetro ${dims.diametro}m`;
  else if (shape === "l-shape")
    medidas = `Sección 1: ${dims.largo1}m × ${dims.ancho1}m / Sección 2: ${dims.largo2}m × ${dims.ancho2}m`;
  else medidas = "Forma irregular (adjunto medidas)";

  const shapeLabel = shapes.find((s) => s.id === shape)?.label ?? shape;
  const priceStr = price ? `$${Math.round(price * PRICE_PER_M2).toLocaleString("es-MX")} MXN` : "Por cotizar";

  return encodeURIComponent(
    `Hola, me interesa cotizar una cubierta térmica.\n\n` +
    `Forma: ${shapeLabel}\n` +
    `Medidas: ${medidas}\n` +
    `Precio base calculado: ${priceStr}\n` +
    `Ciudad: ${ciudad}\n` +
    `Código Postal: ${cp}\n\n` +
    `¿Me pueden dar el precio final con envío incluido?`
  );
}

export default function Calculator() {
  const [shape, setShape] = useState<Shape | null>(null);
  const [dims, setDims] = useState<Record<string, string>>({});
  const [step, setStep] = useState<Step>("form");
  const [ciudad, setCiudad] = useState("");
  const [cp, setCp] = useState("");
  const [area, setArea] = useState<number | null>(null);
  const startedRef = useRef(false);

  const price = area !== null ? area * PRICE_PER_M2 : null;

  function handleShapeSelect(s: Shape) {
    if (!startedRef.current) {
      quoteStart("termica");
      startedRef.current = true;
    }
    setShape(s);
    setDims({});
    setStep("form");
    setArea(null);
  }

  function handleDimChange(key: string, val: string) {
    if (!startedRef.current) {
      quoteStart("termica");
      startedRef.current = true;
    }
    setDims((prev) => ({ ...prev, [key]: val }));
  }

  function handleCalculate() {
    if (!shape) return;
    if (shape === "irregular") {
      setStep("price");
      return;
    }
    const a = calcArea(shape, dims);
    if (a === null || a <= 0) return;
    setArea(a);
    const p = a * PRICE_PER_M2;
    quotePriceShown({
      productType: "termica",
      largo: parseFloat(dims.largo ?? dims.largo1 ?? "0"),
      ancho: parseFloat(dims.ancho ?? dims.ancho1 ?? "0"),
      precioBase: Math.round(p),
    });
    setStep("price");
  }

  function handleSendContact() {
    if (!ciudad.trim() || !cp.trim()) return;
    // Disparar tracking ANTES de mostrar pantalla de confirmación
    trackLead("termica", "calculadora_cotizacion", {
      precioBase: price ? Math.round(price) : undefined,
      ciudad: ciudad.trim(),
      cp: cp.trim(),
    });
    setStep("confirm");
  }

  const waMsg = buildWhatsAppMsg(shape ?? "rectangular", dims, area, ciudad, cp);
  const waUrl = `https://wa.me/525548919773?text=${waMsg}`;

  return (
    <section id="calculadora" className="bg-white border-t border-navy/10">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <span className="label-caps text-teal block mb-2">Calculadora de precio</span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight mb-10">
          ¿Cuánto cuesta tu cubierta?
        </h2>

        {/* PASO 1 — Forma + medidas */}
        {(step === "form" || step === "price") && (
          <>
            {/* Selector de forma */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {shapes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleShapeSelect(s.id)}
                  className={`border rounded-sm py-4 px-3 text-center transition-all ${
                    shape === s.id
                      ? "border-navy bg-navy/5 border-2"
                      : "border-navy/20 bg-white hover:border-navy/40"
                  }`}
                >
                  <span className="block text-2xl mb-2">{s.icon}</span>
                  <span className="text-xs font-semibold text-navy tracking-wide">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Inputs dinámicos */}
            {shape === "rectangular" && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <DimInput label="Largo (m)" value={dims.largo ?? ""} onChange={(v) => handleDimChange("largo", v)} placeholder="ej. 8.5" />
                <DimInput label="Ancho (m)" value={dims.ancho ?? ""} onChange={(v) => handleDimChange("ancho", v)} placeholder="ej. 4.0" />
              </div>
            )}

            {shape === "circular" && (
              <div className="grid grid-cols-1 gap-4 mb-6 max-w-xs">
                <DimInput label="Diámetro (m)" value={dims.diametro ?? ""} onChange={(v) => handleDimChange("diametro", v)} placeholder="ej. 3.5" />
              </div>
            )}

            {shape === "l-shape" && (
              <div className="mb-6">
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">Sección 1</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <DimInput label="Largo (m)" value={dims.largo1 ?? ""} onChange={(v) => handleDimChange("largo1", v)} placeholder="ej. 6.0" />
                  <DimInput label="Ancho (m)" value={dims.ancho1 ?? ""} onChange={(v) => handleDimChange("ancho1", v)} placeholder="ej. 3.0" />
                </div>
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">Sección 2</p>
                <div className="grid grid-cols-2 gap-4">
                  <DimInput label="Largo (m)" value={dims.largo2 ?? ""} onChange={(v) => handleDimChange("largo2", v)} placeholder="ej. 4.0" />
                  <DimInput label="Ancho (m)" value={dims.ancho2 ?? ""} onChange={(v) => handleDimChange("ancho2", v)} placeholder="ej. 2.5" />
                </div>
              </div>
            )}

            {shape === "irregular" && (
              <div className="border border-navy/15 rounded-sm p-5 mb-6 bg-navy/[0.02]">
                <p className="text-sm text-navy font-semibold mb-1">Alberca con forma irregular</p>
                <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                  Para albercas con formas especiales calculamos el precio contigo por WhatsApp.
                  Prepara una foto o croquis con las medidas de cada lado — con eso te damos precio exacto en minutos.
                </p>
              </div>
            )}

            {shape && (
              <button
                type="button"
                onClick={handleCalculate}
                disabled={
                  shape !== "irregular" && calcArea(shape, dims) === null
                }
                className="w-full md:w-auto bg-navy text-white font-semibold text-sm tracking-widest uppercase py-4 px-10 hover:bg-teal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {shape === "irregular" ? "Cotizar por WhatsApp →" : "Calcular precio →"}
              </button>
            )}
          </>
        )}

        {/* PASO 2 — Precio mostrado */}
        {step === "price" && shape !== "irregular" && (
          <div className="mt-8">
            <div className="border border-navy bg-navy/[0.03] rounded-sm p-6 flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Cubierta térmica · {area?.toFixed(1)} m²
                </p>
                <p className="text-3xl font-extrabold text-navy tracking-tight">
                  ${price ? Math.round(price).toLocaleString("es-MX") : "—"} MXN
                </p>
                <p className="text-xs text-gray-400 mt-1">Sin envío · Precio base</p>
              </div>
              <button
                type="button"
                onClick={() => { setStep("form"); setArea(null); }}
                className="text-xs text-gray-400 hover:text-navy underline"
              >
                Editar medidas
              </button>
            </div>

            <div className="border-t border-navy/10 pt-8">
              <p className="text-sm font-semibold text-navy mb-1">¿Te interesa?</p>
              <p className="text-sm text-gray-500 mb-6">
                Dinos dónde estás y te mandamos el precio final con envío incluido por WhatsApp.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ciudad</label>
                  <input
                    type="text"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    placeholder="ej. Guadalajara"
                    className="w-full border border-navy/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Código Postal</label>
                  <input
                    type="text"
                    value={cp}
                    onChange={(e) => setCp(e.target.value)}
                    placeholder="ej. 44100"
                    className="w-full border border-navy/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-navy"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleSendContact}
                disabled={!ciudad.trim() || !cp.trim()}
                className="w-full md:w-auto bg-navy text-white font-semibold text-sm tracking-widest uppercase py-4 px-10 hover:bg-teal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Enviar por WhatsApp →
              </button>
            </div>
          </div>
        )}

        {/* PASO 3 — Pantalla de confirmación */}
        {step === "confirm" && (
          <div className="mt-8 text-center py-10">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "#e6f7f7" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#00B5B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-navy mb-2">¡Listo!</h3>
            <p className="text-sm leading-relaxed text-gray-500 mb-8 max-w-sm mx-auto">
              Abre WhatsApp y mándanos el mensaje — te respondemos con el precio final incluyendo envío a {ciudad}.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#25D366] text-white font-semibold text-sm tracking-widest uppercase py-4 px-10 hover:opacity-90 transition-opacity"
            >
              Abrir WhatsApp →
            </a>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setShape(null);
                  setDims({});
                  setArea(null);
                  setCiudad("");
                  setCp("");
                  startedRef.current = false;
                }}
                className="text-xs text-gray-400 hover:text-navy underline"
              >
                Nueva cotización
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function DimInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type="number"
        min="0"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-navy/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-navy"
      />
    </div>
  );
}
