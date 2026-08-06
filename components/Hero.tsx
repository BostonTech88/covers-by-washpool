"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Hero() {
  const images = useMemo(
    () => [
      { src: "/hero-1.jpg" },
      { src: "/hero-2.jpg" },
      { src: "/hero-3.jpg" },
      { src: "/hero-4.jpg" },
      { src: "/hero-5.jpg" },
      { src: "/hero-6.jpg" },
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
      goTo((active + 1) % images.length);
    }, 5000);
  };

  const goTo = (next: number) => {
    if (next === active) return;
    if (fadeTimeoutRef.current) window.clearTimeout(fadeTimeoutRef.current);
    setPrev(active);
    setActive(next);
    fadeTimeoutRef.current = window.setTimeout(() => setPrev(null), 700);
  };

  useEffect(() => {
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
    <section className="relative w-full" style={{ height: "100vh", minHeight: 560 }}>
      {/* Carousel de fondo */}
      <div className="absolute inset-0">
        {images.map((img, idx) => {
          const isActive = idx === active;
          const isPrev = prev !== null && idx === prev;
          if (!isActive && !isPrev) return null;
          return (
            <div
              key={img.src}
              className="absolute inset-0"
              style={{
                opacity: isActive ? 1 : 0,
                transition: "opacity 0.7s ease",
                pointerEvents: "none",
              }}
            >
              <Image
                src={img.src}
                alt="Cubierta térmica para alberca"
                fill
                className="object-cover"
                priority={idx === 0}
                sizes="100vw"
              />
            </div>
          );
        })}
      </div>

      {/* Overlay gradiente — oscuro abajo, transparente arriba */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(5,21,37,0.88) 0%, rgba(5,21,37,0.35) 45%, transparent 75%)",
        }}
      />

      {/* Texto — esquina inferior izquierda */}
      <div className="absolute bottom-0 left-0 px-8 md:px-14 pb-10 md:pb-14">
        <span
          className="block mb-2 text-teal"
          style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}
        >
          Cubiertas a tu medida · Todo México
        </span>
        <h1
          className="text-white font-extrabold leading-tight tracking-tight mb-2"
          style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
        >
          Tu alberca lista<br />cuando quieras usarla.
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>
          Fabricada a tus medidas. Retiene el calor, bloquea la suciedad.
        </p>
      </div>

      {/* Flechas */}
      <button
        type="button"
        aria-label="Imagen anterior"
        onClick={() => goTo((active - 1 + images.length) % images.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
        style={{ borderRadius: 2 }}
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Imagen siguiente"
        onClick={() => goTo((active + 1) % images.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
        style={{ borderRadius: 2 }}
      >
        →
      </button>

      {/* Dots — esquina inferior derecha */}
      <div className="absolute bottom-10 right-8 md:right-14 flex items-center gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Imagen ${idx + 1}`}
            onClick={() => goTo(idx)}
            style={{
              width: idx === active ? 8 : 5,
              height: idx === active ? 8 : 5,
              borderRadius: 9999,
              background: idx === active ? "#fff" : "rgba(255,255,255,0.35)",
              transition: "all 0.2s",
            }}
          />
        ))}
      </div>
    </section>
  );
}
