"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Hero() {
  const images = useMemo(
    () => [
      { src: "/hero-1.jpg", portrait: false },
      { src: "/hero-2.jpg", portrait: false },
      { src: "/hero-3.jpg", portrait: false },
      { src: "/hero-4.jpg", portrait: false },
      { src: "/hero-5.jpg", portrait: false },
      { src: "/hero-6.jpg", portrait: false },
    ],
    []
  );

  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const tickTimeoutRef = useRef<number | null>(null);

  const scheduleNext = () => {
    if (tickTimeoutRef.current) window.clearTimeout(tickTimeoutRef.current);
    tickTimeoutRef.current = window.setTimeout(() => {
      goTo((active + 1) % images.length, false);
    }, 5000);
  };

  const goTo = (next: number, resetTimer: boolean) => {
    if (next === active) {
      if (resetTimer) scheduleNext();
      return;
    }
    if (fadeTimeoutRef.current) window.clearTimeout(fadeTimeoutRef.current);
    setPrev(active);
    setActive(next);
    fadeTimeoutRef.current = window.setTimeout(() => setPrev(null), 600);
    if (resetTimer) scheduleNext();
  };

  useEffect(() => {
    // Preload images
    for (const img of images) {
      const i = new window.Image();
      i.src = img.src;
    }
  }, [images]);

  useEffect(() => {
    scheduleNext();
    return () => {
      if (fadeTimeoutRef.current) window.clearTimeout(fadeTimeoutRef.current);
      if (tickTimeoutRef.current) window.clearTimeout(tickTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <section className="bg-white" style={{ borderBottom: "1px solid #e5e7eb" }}>
      <div className="grid md:grid-cols-[55fr_45fr] md:min-h-[88vh]">
        <div className="flex justify-end bg-white">
          <div className="w-full max-w-[640px] px-6 md:pl-8 xl:pl-16 md:pr-16 py-24 md:py-32 flex flex-col justify-center">
            <span className="label-caps text-teal mb-6 block">
              La cubierta que necesitas
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold text-navy leading-[1.05] tracking-tight mb-6">
              Tu alberca lista cuando quieras usarla.
            </h1>

            <p className="text-base md:text-lg leading-relaxed mb-8 max-w-md" style={{ color: "#374151" }}>
              Fabricada  a la medida de tu alberca. <br />Mantiene el calor, bloquea la
              basura y reduce la evaporación.
            </p>

            <a
              href="#el-proceso"
              className="text-navy font-semibold text-sm hover:text-teal transition-colors self-start"
            >
              → Ver cómo funciona
            </a>
          </div>
        </div>

        <div className="relative h-72 md:h-auto">
          {/* Carousel */}
          <div className="absolute inset-0">
            {images.map((img, idx) => {
              const isActive = idx === active;
              const isPrev = prev !== null && idx === prev;
              const shouldMount = isActive || isPrev;
              if (!shouldMount) return null;

              const objectPosition = img.portrait ? "top" : "center";
              const opacity = isActive ? 1 : 0;

              return (
                <div
                  key={img.src}
                  className="absolute inset-0"
                  style={{
                    opacity,
                    transition: "opacity 0.6s ease",
                    pointerEvents: "none",
                  }}
                >
                  <Image
                    src={img.src}
                    alt="Cubierta térmica para alberca"
                    fill
                    className="object-cover"
                    style={{ objectPosition }}
                    priority={idx === 0}
                  />
                </div>
              );
            })}

            {/* Arrows */}
            <button
              type="button"
              aria-label="Imagen anterior"
              onClick={() => goTo((active - 1 + images.length) % images.length, true)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-[36px] h-[36px] bg-white hover:bg-white/90 text-navy flex items-center justify-center"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Imagen siguiente"
              onClick={() => goTo((active + 1) % images.length, true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-[36px] h-[36px] bg-white hover:bg-white/90 text-navy flex items-center justify-center"
            >
              →
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {images.map((_, idx) => {
                const isActive = idx === active;
                return (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Ir a imagen ${idx + 1}`}
                    onClick={() => goTo(idx, true)}
                    className="transition-all"
                    style={{
                      width: isActive ? 8 : 6,
                      height: isActive ? 8 : 6,
                      borderRadius: 9999,
                      background: isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.4)",
                      opacity: isActive ? 1 : 0.9,
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="absolute inset-y-0 left-0 w-px bg-navy/10 hidden md:block" />
        </div>
      </div>
    </section>
  );
}
