"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#1a3a5c]/95 backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="18" fill="rgba(255,255,255,0.15)"/>
            <path d="M8 22 Q18 13 28 22" stroke="#00B5B8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M10 26 Q18 18 26 26" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
          </svg>
          <span className="text-white font-extrabold tracking-widest uppercase text-sm">
            Covers <span className="hidden sm:inline font-light opacity-60">by Washpool</span>
          </span>
        </a>

        {/* Redes sociales + CTA */}
        <div className="flex items-center gap-3">
          {/* Iconos — solo en tablet+ */}
          <div className="hidden md:flex items-center gap-3">
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
          </div>
          <a
            href="#calculadora"
            className={`label-caps px-4 py-2.5 transition-colors text-xs ${
              scrolled
                ? "bg-white text-navy hover:bg-white/90"
                : "bg-white/20 text-white hover:bg-white/30 border border-white/40"
            }`}
            onClick={() => (window as any).gtag_report_conversion?.()}
          >
            <span className="hidden sm:inline">Solicitar </span>Cotización
          </a>
        </div>
      </div>
    </header>
  );
}
