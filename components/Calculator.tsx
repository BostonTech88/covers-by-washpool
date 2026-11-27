"use client";
import { useRef, useState, type FormEvent } from "react";
import { quoteStart, quotePriceShown } from "@/lib/analytics";
import {
  calcArea,
  buildThermalMessage,
  shapes,
  PRICE_PER_M2,
  type Shape,
} from "@/lib/calculator";
import WhatsAppLink from "./WhatsAppLink";

const fields: Record<Shape, [string, string][]> = {
  rectangular: [
    ["largo", "Largo (m)"],
    ["ancho", "Ancho (m)"],
  ],
  circular: [["diametro", "Diámetro (m)"]],
  "l-shape": [
    ["largo1", "Largo · sección 1 (m)"],
    ["ancho1", "Ancho · sección 1 (m)"],
    ["largo2", "Largo · sección 2 (m)"],
    ["ancho2", "Ancho · sección 2 (m)"],
  ],
  irregular: [],
};

export default function Calculator() {
  const [shape, setShape] = useState<Shape>("rectangular");
  const [dims, setDims] = useState<Record<string, string>>({});
  const [area, setArea] = useState<number | null>(null);
  const started = useRef(false);
  function start() {
    if (!started.current) {
      quoteStart("termica");
      started.current = true;
    }
  }
  function calculate(event: FormEvent) {
    event.preventDefault();
    const next = calcArea(shape, dims);
    if (next === null) return;
    start();
    setArea(next);
    quotePriceShown({
      productType: "termica",
      largo: Number(dims.largo ?? dims.largo1 ?? 0),
      ancho: Number(dims.ancho ?? dims.ancho1 ?? 0),
      precioBase: Math.round(next * PRICE_PER_M2),
    });
  }
  return (
    <section
      id="calculadora"
      className="section calculator-section"
      aria-labelledby="calculator-title"
    >
      <div className="wrap calculator-layout">
        <div className="calculator-intro">
          <p className="eyebrow">TU ALBERCA, TU MEDIDA</p>
          <h2 id="calculator-title">
            Tu precio.
            <br />
            <span className="text-teal-dark">Sin complicaciones.</span>
          </h2>
          <p>
            Elige la forma de tu alberca e ingresa sus medidas. Obtén un
            estimado y resuelve los detalles por WhatsApp.
          </p>
          <div className="rate">
            <strong>${PRICE_PER_M2}</strong>
            <span>
              MXN por m²
              <br />
              Precio base de cubierta térmica
            </span>
          </div>
          <p className="small muted">
            Mide el largo y ancho de pared a pared, por debajo del borde. Para
            una forma de L, mide dos rectángulos sin superponerlos.
          </p>
          <WhatsAppLink source="calculator_help" className="text-link">
            ¿Prefieres que te ayudemos? Escríbenos ↗
          </WhatsAppLink>
        </div>
        <div className="calculator-card">
          <form onSubmit={calculate}>
            <fieldset>
              <legend>
                <span className="step-dot">1</span> ¿Qué forma tiene tu alberca?
              </legend>
              <div className="shape-grid">
                {shapes.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    aria-pressed={shape === item.id}
                    className={`shape-button ${shape === item.id ? "selected" : ""}`}
                    onClick={() => {
                      start();
                      setShape(item.id);
                      setDims({});
                      setArea(null);
                    }}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </fieldset>
            {shape !== "irregular" ? (
              <>
                <fieldset className="measure-fields">
                  <legend>
                    <span className="step-dot">2</span> Agrega las medidas en
                    metros
                  </legend>
                  <div className="dimensions-grid">
                    {fields[shape].map(([key, label]) => (
                      <label key={key} htmlFor={`dim-${key}`}>
                        {label}
                        <input
                          id={`dim-${key}`}
                          type="number"
                          min="0.01"
                          step="any"
                          inputMode="decimal"
                          required
                          placeholder="0.00"
                          value={dims[key] ?? ""}
                          onChange={(event) => {
                            start();
                            setDims((current) => ({
                              ...current,
                              [key]: event.target.value,
                            }));
                            setArea(null);
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </fieldset>
                <button
                  className="button button-primary full-width"
                  type="submit"
                  disabled={calcArea(shape, dims) === null}
                >
                  Calcular mi precio <span aria-hidden="true">→</span>
                </button>
              </>
            ) : (
              <div className="irregular-note">
                <h3>Cada forma tiene una solución.</h3>
                <p>
                  Envíanos una foto o croquis con las medidas por WhatsApp para
                  preparar una cotización personalizada. Adjunta los archivos
                  manualmente en la conversación.
                </p>
              </div>
            )}
          </form>
          {(area !== null || shape === "irregular") && (
            <div className="price-result" aria-live="polite" aria-atomic="true">
              {area !== null && (
                <>
                  <span className="eyebrow">PRECIO BASE ESTIMADO</span>
                  <p className="price">
                    ${Math.round(area * PRICE_PER_M2).toLocaleString("es-MX")}{" "}
                    <span>MXN</span>
                  </p>
                  <p className="small">
                    Para{" "}
                    {area.toLocaleString("es-MX", { maximumFractionDigits: 2 })}{" "}
                    m² de cubierta térmica.
                  </p>
                </>
              )}
              <p className="small">
                Confirmaremos las medidas, los detalles y el total final con
                envío por WhatsApp.
              </p>
              <WhatsAppLink
                source="calculadora_cotizacion"
                message={buildThermalMessage(shape, dims, area)}
                className="button button-primary full-width"
              >
                Continuar por WhatsApp ↗
              </WhatsAppLink>
              <p className="fine-print">
                Se abrirá un mensaje preparado. Debes enviarlo en WhatsApp;
                abrirlo no confirma su recepción. Las fotos se adjuntan
                manualmente.
              </p>
            </div>
          )}
          {area === null && shape !== "irregular" && (
            <p className="fine-print">
              Sin registro. Sin datos de ubicación. El total final se confirma
              por WhatsApp.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
