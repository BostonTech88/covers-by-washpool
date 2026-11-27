import Image from "next/image";
import SecurityQuoteForm from "./SecurityQuoteForm";
import WhatsAppLink from "./WhatsAppLink";
export default function SafetyCover() {
  return (
    <section id="cotizacion-seguridad" className="safety-section">
      <div className="wrap">
        <details className="safety-details">
          <summary>
            <span>
              <span className="eyebrow">¿BUSCAS OTRO TIPO DE CUBIERTA?</span>
              <strong>Cubiertas de seguridad</strong>
              <span>Cotización personalizada para tu proyecto.</span>
            </span>
            <span className="safety-expand" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="safety-content">
            <div>
              <div className="safety-photo">
                <Image
                  src="/images/safety-cover.webp"
                  alt="Cubierta de seguridad gris sujeta alrededor de una alberca"
                  fill
                  sizes="(max-width: 767px) 100vw, 40vw"
                />
              </div>
              <p>
                Las cubiertas de seguridad son un producto distinto a las
                térmicas. Revisamos las medidas y las condiciones de la alberca
                para cotizarlas.
              </p>
              <WhatsAppLink
                source="safety_direct"
                product="seguridad"
                message="Hola, me interesa cotizar una cubierta de seguridad para mi alberca."
                className="text-link"
              >
                Prefiero hablar directamente por WhatsApp ↗
              </WhatsAppLink>
            </div>
            <SecurityQuoteForm />
          </div>
        </details>
      </div>
    </section>
  );
}
