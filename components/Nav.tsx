"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[#1a3a5c]/95 backdrop-blur-sm"
          : "bg-[#1a3a5c]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo — sits directly on navy background */}
        <a href="#" className="block">
          <Image
            src="/logo-covers.jpeg"
            alt="Covers by Washpool"
            height={52}
            width={0}
            sizes="100vw"
            style={{ width: "auto", height: "52px" }}
            priority
          />
        </a>

        {/* CTA */}
        <a
          href="#cotizacion"
          className="label-caps bg-white text-navy px-5 py-2.5 hover:bg-white/90 transition-colors"
        >
          Solicitar Cotización
        </a>
      </div>
    </header>
  );
}
