import Image from "next/image";
import WhatsAppLink from "./WhatsAppLink";
export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="wrap hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-dot" /> HECHAS PARA TU ALBERCA
          </p>
          <h1>
            Cubiertas térmicas para tu alberca.
            <br />
            <span>Hechas a tu medida.</span>
          </h1>
          <p className="hero-description">
            Conserva mejor la temperatura del agua y reduce la evaporación.
            Calcula fácilmente tu precio y continúa tu compra por WhatsApp.
          </p>
          <div className="hero-buttons">
            <a href="#calculadora" className="button button-primary">
              Calcular mi precio <span aria-hidden="true">→</span>
            </a>
            <WhatsAppLink source="hero">Hablar por WhatsApp ↗</WhatsAppLink>
          </div>
          <div className="hero-note">
            <span aria-hidden="true">✓</span> A tu medida{" "}
            <span aria-hidden="true">·</span> Atención directa{" "}
            <span aria-hidden="true">·</span> Envíos en México
          </div>
        </div>
        <div className="hero-photo">
          <Image
            src="/images/thermal-hero.webp"
            alt="Cubierta térmica azul sobre una alberca rectangular bajo una pérgola"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 52vw"
          />
          <div className="photo-caption">
            <span className="caption-icon" aria-hidden="true">
              〰
            </span>
            <div>
              <strong>Una cubierta. Tu alberca.</strong>
              <span>Fabricación a medida, en cada detalle.</span>
            </div>
          </div>
          <span className="photo-tag">FOTOGRAFÍA REAL</span>
        </div>
      </div>
    </section>
  );
}
