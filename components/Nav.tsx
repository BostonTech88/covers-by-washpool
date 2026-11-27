"use client";
import Image from "next/image";
import { useState } from "react";
const links = [
  ["#termicas", "Cubiertas térmicas"],
  ["#como-comprar", "Cómo funciona"],
  ["#galeria", "Fotos reales"],
];
export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="wrap nav-row">
        <a
          href="#inicio"
          aria-label="Covers by Washpool, inicio"
          className="brand"
        >
          <Image
            src="/images/logo.webp"
            alt="Covers by Washpool"
            width={160}
            height={55}
            priority
          />
        </a>
        <nav aria-label="Navegación principal" className="desktop-nav">
          {links.map(([href, label]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a
            href="#calculadora"
            className="button button-primary nav-quote"
            onClick={() => setOpen(false)}
          >
            Cotizar <span aria-hidden="true">↗</span>
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen(!open)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      <nav
        id="mobile-menu"
        className="mobile-nav"
        aria-label="Navegación móvil"
        hidden={!open}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        {links.map(([href, label]) => (
          <a href={href} key={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
