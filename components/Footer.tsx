import Image from "next/image";
import WhatsAppLink from "./WhatsAppLink";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <a href="#inicio">
              <Image
                src="/images/logo.webp"
                alt="Covers by Washpool"
                width={180}
                height={62}
              />
            </a>
            <p>
              Cubiertas térmicas de calidad,
              <br />
              hechas a la medida de tu alberca.
            </p>
            <p className="small">
              Querétaro y alrededores.
              <br />
              Atendemos pedidos en México.
            </p>
          </div>
          <nav aria-label="Explorar">
            <h2>Explora</h2>
            <a href="#termicas">Cubiertas térmicas</a>
            <a href="#calculadora">Calculadora de precio</a>
            <a href="#galeria">Fotos reales</a>
            <a href="#preguntas">Preguntas frecuentes</a>
            <a href="#cotizacion-seguridad">Cubiertas de seguridad</a>
          </nav>
          <div className="footer-contact">
            <h2>Hablemos de tu alberca</h2>
            <WhatsAppLink source="footer" className="footer-whatsapp">
              WhatsApp {WHATSAPP_DISPLAY} ↗
            </WhatsAppLink>
            <p className="small">
              Cotizaciones y atención directa.
              <br />
              Sin formularios de registro.
            </p>
            <div className="social-links">
              <a
                href="https://www.instagram.com/coversbywp/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram ↗
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61591902690026"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook ↗
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Covers by Washpool</span>
          <span>Hechas a medida. Sin complicaciones.</span>
        </div>
      </div>
    </footer>
  );
}
