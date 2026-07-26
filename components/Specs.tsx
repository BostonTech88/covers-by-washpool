"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

const thermalHighlights = [
  { label: "Precio", value: "$121 MXN / m² + envío" },
  { label: "Material", value: "LDPE 100%, burbujas de aire sellado" },
  { label: "Entrega", value: "8–18 días hábiles" },
];

const securityHighlights = [
  { label: "Material", value: "Malla HD tensada" },
  { label: "Resistencia", value: "Hasta 100 kg/m²" },
  { label: "Sistema", value: "Anclaje perimetral de acero inox." },
  { label: "Entrega", value: "10–12 semanas" },
];

export default function Specs() {
  const gallery = useMemo(
    () => [
      { src: "/seguridad-1.jpg", caption: "Instalación residencial — deck de madera" },
      { src: "/seguridad-2.jpg", caption: "Cubierta de malla HD — casa moderna" },
      { src: "/seguridad-3.jpg", caption: "Acabado gris — jardín residencial" },
      { src: "/seguridad-4.jpg", caption: "Instalación en casa de lujo" },
    ],
    []
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const closeTimeoutRef = useRef<number | null>(null);

  const openLightbox = () => {
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    setLightboxOpen(true);
    requestAnimationFrame(() => setLightboxVisible(true));
  };

  const closeLightbox = () => {
    setLightboxVisible(false);
    closeTimeoutRef.current = window.setTimeout(() => setLightboxOpen(false), 200);
  };

  const prev = () => setActiveIdx((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setActiveIdx((i) => (i + 1) % gallery.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen]);

  return (
    <section id="productos" className="bg-white">

      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-14">
        <span className="label-caps text-teal block mb-4">Nuestros productos</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-navy tracking-tight">
          Elige la cubierta correcta para tu alberca.
        </h2>
      </div>

      {/* ── Cubierta Térmica: texto izquierda, foto derecha ── */}
      <div className="border-t border-navy/10">
        <div className="grid md:grid-cols-2 min-h-[520px]">

          {/* Texto */}
          <div className="flex justify-end bg-white">
            <div className="w-full max-w-[580px] px-6 md:pl-8 xl:pl-16 md:pr-16 py-16 md:py-20 flex flex-col justify-center">
              <span className="label-caps inline-block bg-teal text-white px-3 py-1.5 mb-6 self-start">
                Producto principal
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight mb-2">
                Cubierta Térmica
              </h3>
              <p className="text-sm mb-10" style={{ color: "#6b7280" }}>
                Tu alberca caliente y limpia, todo el año
              </p>

              <div className="flex flex-col gap-0 mb-10 border-t border-navy/10">
                {thermalHighlights.map((h) => (
                  <div
                    key={h.label}
                    className="flex gap-6 items-center border-b border-navy/10 py-4"
                  >
                    <span className="text-xs tracking-wider uppercase w-24 flex-shrink-0" style={{ color: "#9ca3af" }}>
                      {h.label}
                    </span>
                    <span className="text-sm" style={{ color: "#1f2937" }}>{h.value}</span>
                  </div>
                ))}
              </div>

              <a
                href="#cotizacion-termica"
                className="inline-block bg-navy text-white font-semibold text-sm tracking-widest uppercase py-4 px-8 hover:bg-teal transition-colors text-center self-start"
              >
                Cotizar por WhatsApp →
              </a>
            </div>
          </div>

          {/* Foto */}
          <div className="relative h-72 md:h-auto">
            <div className="absolute inset-y-0 left-0 w-px bg-navy/10 hidden md:block" />
            <Image
              src="/hero-1.jpg"
              alt="Cubierta térmica para alberca"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      {/* ── Cubierta de Seguridad: foto izquierda, texto derecha ── */}
      <div className="border-t border-navy/10 border-b border-navy/10">
        <div className="grid md:grid-cols-2 min-h-[520px]">

          {/* Foto (se mueve abajo en móvil) */}
          <div className="relative h-72 md:h-auto order-2 md:order-1">
            <Image
              src="/seguridad-2.jpg"
              alt="Cubierta de seguridad para alberca"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Texto */}
          <div className="flex justify-start bg-offwhite order-1 md:order-2">
            <div className="w-full max-w-[580px] px-6 md:pl-16 xl:pl-20 md:pr-8 xl:pr-16 py-16 md:py-20 flex flex-col justify-center">
              <div className="hidden md:block absolute inset-y-0 left-0 w-px bg-navy/10" />
              <h3 className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight mb-2">
                Cubierta de Seguridad
              </h3>
              <p className="text-sm mb-10" style={{ color: "#6b7280" }}>
                Protección real contra accidentes y contaminación
              </p>

              <div className="flex flex-col gap-0 mb-10 border-t border-navy/10">
                {securityHighlights.map((h) => (
                  <div
                    key={h.label}
                    className="flex gap-6 items-center border-b border-navy/10 py-4"
                  >
                    <span className="text-xs tracking-wider uppercase w-24 flex-shrink-0" style={{ color: "#9ca3af" }}>
                      {h.label}
                    </span>
                    <span className="text-sm" style={{ color: "#1f2937" }}>{h.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 items-start">
                <a
                  href="#cotizacion-seguridad"
                  className="inline-block bg-navy text-white font-semibold text-sm tracking-widest uppercase py-4 px-8 hover:bg-teal transition-colors text-center"
                >
                  Cotizar por WhatsApp →
                </a>
                <button
                  type="button"
                  onClick={openLightbox}
                  className="text-sm font-semibold hover:underline transition-colors"
                  style={{ color: "#1e7fd4" }}
                >
                  Ver instalaciones →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-200 ease-out ${
            lightboxVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "rgba(0,0,0,0.9)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 text-white flex items-center justify-center text-2xl"
          >
            ×
          </button>
          <button
            type="button"
            aria-label="Anterior"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 text-white flex items-center justify-center"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-white flex items-center justify-center"
          >
            →
          </button>

          <div className="h-full w-full flex items-center justify-center px-6">
            <div
              className="w-[80vw] h-[80vh] flex flex-col items-center justify-center"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={gallery[activeIdx].src}
                  alt={gallery[activeIdx].caption}
                  fill
                  className="object-contain"
                  sizes="80vw"
                  priority
                />
              </div>
              <p className="text-xs text-center mt-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                {gallery[activeIdx].caption}
              </p>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {gallery.map((_, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Ir a imagen ${idx + 1}`}
                  onClick={() => setActiveIdx(idx)}
                  className="transition-all"
                  style={{
                    width: isActive ? 8 : 6,
                    height: isActive ? 8 : 6,
                    borderRadius: 9999,
                    background: isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.4)",
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
