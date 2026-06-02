"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type SpecItem = { label: string; value: string };

const thermalSpecs: SpecItem[] = [
  { label: "Material", value: "LDPE 100%, burbujas de aire sellado" },
  { label: "Corte", value: "A medida exacta de tu alberca" },
  { label: "Envío", value: "Todo México" },
  { label: "Tiempo de entrega", value: "8–18 días hábiles" },
];

const securitySpecs: SpecItem[] = [
  { label: "Material", value: "Malla HD tensada" },
  { label: "Resistencia", value: "Hasta 100 kg/m²" },
  { label: "Sistema", value: "Anclaje perimetral de acero inox." },
  { label: "Corte", value: "A medida exacta" },
  { label: "Envío", value: "Todo México" },
  { label: "Tiempo de entrega", value: "10–12 semanas" },
];

const ROW_COUNT = 6;

function padSpecs(specs: SpecItem[]): (SpecItem | null)[] {
  const padded: (SpecItem | null)[] = [...specs];
  while (padded.length < ROW_COUNT) padded.push(null);
  return padded;
}

function SpecRow({ spec }: { spec: SpecItem | null }) {
  if (!spec) {
    return (
      <div
        className="min-h-[48px] border-b border-gray-100"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="min-h-[48px] border-b border-gray-100 grid grid-cols-[1fr_1.2fr] gap-4 items-center">
      <span className="text-xs tracking-wider text-gray-400 uppercase">
        {spec.label}
      </span>
      <span className="text-sm text-gray-800 leading-snug">{spec.value}</span>
    </div>
  );
}

function ProductColumn({
  badge,
  title,
  subtitle,
  specs,
  ctaHref,
  afterCta,
}: {
  badge?: React.ReactNode;
  title: string;
  subtitle: string;
  specs: (SpecItem | null)[];
  ctaHref: string;
  afterCta?: React.ReactNode;
}) {
  return (
    <div
      className="grid md:grid-rows-subgrid md:row-span-8 border p-8 min-h-full"
      style={{ border: "1px solid #e5e7eb" }}
    >
      <div>
        {badge}
        <h3 className="text-2xl font-bold text-navy tracking-tight mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      {specs.map((spec, i) => (
        <SpecRow key={i} spec={spec} />
      ))}

      <div className="self-start">
        <a
          href={ctaHref}
          className="inline-block text-navy font-semibold text-sm hover:text-teal transition-colors"
          onClick={() => (window as any).gtag_report_conversion?.()}
        >
          Solicitar cotización →
        </a>
        {afterCta}
      </div>
    </div>
  );
}

export default function Specs() {
  const gallery = useMemo(
    () => [
      {
        src: "/seguridad-1.jpg",
        caption: "Instalación residencial — cubierta de seguridad",
      },
      {
        src: "/seguridad-2.jpg",
        caption: "Sistema de anclaje perimetral tensado",
      },
      {
        src: "/seguridad-3.jpg",
        caption: "Instalación en jardín — acabado premium",
      },
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
    closeTimeoutRef.current = window.setTimeout(() => {
      setLightboxOpen(false);
    }, 200);
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
    <section id="productos" className="bg-white border-y border-navy/10 py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-4">
          <span className="label-caps text-teal">Nuestros productos</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-navy tracking-tight mb-14">
          Elige la cubierta correcta para tu alberca.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_repeat(6,minmax(48px,auto))_auto] gap-8 md:gap-x-8 md:gap-y-0 items-stretch">
          <ProductColumn
            badge={
              <span className="label-caps inline-block bg-teal text-white px-3 py-1.5 mb-5">
                Producto principal
              </span>
            }
            title="Cubierta Térmica"
            subtitle="Tu alberca caliente y limpia, todo el año"
            specs={padSpecs(thermalSpecs)}
            ctaHref="#cotizacion-termica"
          />

          <ProductColumn
            title="Cubierta de Seguridad"
            subtitle="Protección real contra accidentes y contaminación"
            specs={padSpecs(securitySpecs)}
            ctaHref="#cotizacion-seguridad"
            afterCta={
              <button
                type="button"
                onClick={openLightbox}
                className="block mt-2 text-sm hover:underline"
                style={{ color: "#1e7fd4" }}
              >
                Ver instalaciones →
              </button>
            }
          />
        </div>
      </div>

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
            className="absolute top-4 right-4 w-10 h-10 text-white flex items-center justify-center"
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
