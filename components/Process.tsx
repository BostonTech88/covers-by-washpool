import WhatsAppLink from "./WhatsAppLink";
export default function Process() {
  return (
    <section id="como-comprar" className="section process">
      <div className="wrap">
        <div className="section-heading">
          <p className="eyebrow">DE LA MEDIDA A TU ALBERCA</p>
          <h2>
            Tu cubierta térmica
            <br />
            en 3 sencillos pasos.
          </h2>
        </div>
        <div className="process-grid">
          {[
            [
              "01",
              "Calcula.",
              "Introduce las medidas de tu alberca y conoce el precio base estimado.",
            ],
            [
              "02",
              "Confirma.",
              "Continúa por WhatsApp y revisa las medidas, el envío y los detalles de tu pedido.",
            ],
            [
              "03",
              "Compra.",
              "Recibe las opciones de pago y confirma tu pedido con nuestro equipo.",
            ],
          ].map(([number, title, body]) => (
            <article key={number}>
              <span className="process-number">{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <p className="process-note">
          Las opciones de enlace de pago o transferencia se confirman por
          WhatsApp. No necesitas pagar en esta web.
        </p>
        <WhatsAppLink source="process" className="text-link">
          También puedes hablar con nosotros directamente ↗
        </WhatsAppLink>
      </div>
    </section>
  );
}
