import WhatsAppLink from "./WhatsAppLink";
export default function CTA() {
  return (
    <section className="final-cta">
      <div className="wrap">
        <p className="eyebrow">HECHA PARA TI. LISTA PARA COTIZAR.</p>
        <h2>
          Tu cubierta térmica a medida
          <br />
          está a unos pasos.
        </h2>
        <p>
          Empieza con las medidas de tu alberca. Nosotros te ayudamos con lo
          demás.
        </p>
        <div className="hero-buttons">
          <a href="#calculadora" className="button button-light">
            Calcular mi precio →
          </a>
          <WhatsAppLink
            source="final_cta"
            className="button button-outline-light"
          >
            Hablar por WhatsApp ↗
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
