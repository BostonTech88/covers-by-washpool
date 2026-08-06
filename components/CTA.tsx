"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { trackLead } from "@/lib/analytics";

type ProductType = "termica" | "seguridad";

export default function CTA() {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const scrollPendingRef = useRef(false);

  function selectProduct(next: ProductType) {
    setProduct(next);
  }

  function scrollToForm() {
    requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  useEffect(() => {
    function applyHash() {
      const hash = window.location.hash;
      if (hash === "#cotizacion-termica") {
        scrollPendingRef.current = true;
        selectProduct("termica");
      } else if (hash === "#cotizacion-seguridad") {
        scrollPendingRef.current = true;
        selectProduct("seguridad");
      }
    }

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  useEffect(() => {
    if (product && scrollPendingRef.current && formVisible) {
      scrollPendingRef.current = false;
      scrollToForm();
    }
  }, [product, formVisible]);

  useEffect(() => {
    if (product) {
      setFormVisible(false);
      const id = requestAnimationFrame(() => setFormVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setFormVisible(false);
  }, [product]);

  const trustSignals =
    product === "seguridad"
      ? [
          "— Cotización sin costo ni compromiso",
          "— Anticipo del 50% al confirmar",
          "— Entrega en 10 a 12 semanas",
          "— Garantía de fábrica de 15 años",
        ]
      : [
          "— Cotización sin costo ni compromiso",
          "— Anticipo del 50% al confirmar",
          "— Entrega en 7 a 20 días según producto",
          "— Garantía de fábrica de 1 año",
        ];

  return (
    <section id="cotizacion" className="bg-offwhite border-b border-navy/10 py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Step 1 — Product selector */}
        <div className="mb-16">
          <span className="label-caps text-teal block mb-5">
            Cotización sin costo
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy tracking-tight leading-[1.05] mb-10">
            ¿Qué tipo de cubierta necesitas?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              type="button"
              onClick={() => selectProduct("termica")}
              className={`text-left p-6 cursor-pointer transition-colors ${
                product === "termica"
                  ? "border-2 border-navy bg-navy/5"
                  : "border border-navy/20 bg-white"
              }`}
            >
              <h3 className="font-extrabold text-navy text-lg tracking-tight mb-2">
                Cubierta Térmica
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                Para conservar limpieza, calor, reducir evaporación y ahorrar en químicos.
              </p>
            </button>

            <button
              type="button"
              onClick={() => selectProduct("seguridad")}
              className={`text-left p-6 cursor-pointer transition-colors ${
                product === "seguridad"
                  ? "border-2 border-navy bg-navy/5"
                  : "border border-navy/20 bg-white"
              }`}
            >
              <h3 className="font-extrabold text-navy text-lg tracking-tight mb-2">
                Cubierta de Seguridad
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                Para proteger la alberca y prevenir accidentes.
              </p>
            </button>
          </div>
        </div>

        {/* Step 2 — WhatsApp CTA */}
        {product && (
          <div
            ref={formSectionRef}
            className={`grid md:grid-cols-[45fr_55fr] gap-12 md:gap-20 items-start transition-all duration-300 ease-out ${
              formVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {/* Left column */}
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy tracking-tight leading-[1.05] mb-6">
                Cuéntanos de tu alberca.
              </h2>
              <p className="text-base md:text-lg leading-relaxed max-w-sm" style={{ color: "#374151" }}>
                Te respondemos en menos de 2 horas por WhatsApp.
              </p>

              <div className="mt-10 flex flex-col gap-3 border-t border-navy/10 pt-8">
                {trustSignals.map((signal) => (
                  <p
                    key={signal}
                    className="text-sm leading-relaxed"
                    style={{ color: "#6b7280" }}
                  >
                    {signal}
                  </p>
                ))}
              </div>

              <div
                className="border-l-2 border-teal pl-4 py-2 mt-6"
                style={{ background: "color-mix(in srgb, #1a3a5c 3%, transparent)" }}
              >
                <p className="text-sm font-semibold text-navy mb-2">
                  ¿Cómo medir tu alberca?
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  Mide de pared a pared en el punto más largo y en el punto más ancho. Por debajo de la nariz de la alberca.
                  <br />
                  <br />
                  Para albercas rectangulares o cuadradas necesitas dos medidas: largo y ancho.
                  <br />
                  <br />
                  Para albercas irregulares necesitas un plano, croquis o foto con medidas anotadas.
                  Sin este documento no podemos cotizar.
                </p>
              </div>

              {product === "termica" && (
                <div className="relative w-full h-[240px] mt-6">
                  <Image
                    src="/hero-2.jpg"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover object-center"
                  />
                </div>
              )}

              {product === "seguridad" && (
                <div className="mt-6 flex flex-col gap-0">
                  <div className="relative w-full h-[180px]">
                    <Image
                      src="/seguridad-1.jpg"
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="relative w-full h-[180px]">
                    <Image
                      src="/seguridad-2.jpg"
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="relative w-full h-[180px]">
                    <Image
                      src="/seguridad-3.jpg"
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right column — WhatsApp CTA */}
            <div className="border-l border-navy/10 pl-10 md:pl-12">
              {product === "termica" ? (
                <div id="cotizacion-termica" className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight leading-tight mb-3">
                      ¿Listo para cotizar tu cubierta térmica?
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: "#374151" }}>
                      Escríbenos con las medidas de tu alberca y tu ciudad — te damos precio y envío en minutos.
                    </p>
                  </div>
                  <a
                    href="https://wa.me/525548919773?text=Hola%2C%20me%20interesa%20cotizar%20una%20cubierta%20t%C3%A9rmica%20para%20mi%20alberca."
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackLead("termica", "cta_termica")}
                    className="inline-block bg-navy text-white font-semibold text-sm tracking-widest uppercase py-4 px-8 hover:bg-teal transition-colors text-center"
                  >
                    Cotizar por WhatsApp →
                  </a>
                </div>
              ) : (
                <div id="cotizacion-seguridad" className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight leading-tight mb-3">
                      ¿Listo para cotizar tu cubierta de seguridad?
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: "#374151" }}>
                      Escríbenos con las medidas de tu alberca y tu ciudad — te damos precio y envío en minutos.
                    </p>
                  </div>
                  <a
                    href="https://wa.me/525548919773?text=Hola%2C%20me%20interesa%20cotizar%20una%20cubierta%20de%20seguridad%20para%20mi%20alberca."
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackLead("seguridad", "cta_seguridad")}
                    className="inline-block bg-navy text-white font-semibold text-sm tracking-widest uppercase py-4 px-8 hover:bg-teal transition-colors text-center"
                  >
                    Cotizar por WhatsApp →
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
