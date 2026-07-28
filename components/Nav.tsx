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

        {/* Redes sociales + CTA */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.facebook.com/profile.php?id=61591902690026"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
          <a
            href="https://www.instagram.com/coversbywp/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a
            href="#cotizacion"
            className="label-caps bg-white text-navy px-5 py-2.5 hover:bg-white/90 transition-colors"
            onClick={() => (window as any).gtag_report_conversion?.()}
          >
            Solicitar Cotización
          </a>
        </div>
      </div>
    </header>
  );
}
