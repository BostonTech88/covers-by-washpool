import Image from "next/image";
const features = [
  [
    "01",
    "Calidad del producto",
    "Materiales y acabados de calidad para cubrir tu alberca en el día a día.",
  ],
  [
    "02",
    "Hecha a tu medida",
    "Una cubierta adaptada a las dimensiones y a la forma de tu alberca.",
  ],
  [
    "03",
    "Compra sencilla",
    "Calcula tu precio y confirma los detalles de tu pedido por WhatsApp.",
  ],
];
export default function FeatureList() {
  return (
    <>
      <section className="differentiators" aria-label="Por qué elegir Covers">
        <div className="wrap feature-grid">
          {features.map(([number, title, description]) => (
            <article key={number}>
              <span className="feature-number">{number}</span>
              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="termicas" className="section benefits">
        <div className="wrap benefits-layout">
          <div className="benefit-photo">
            <Image
              src="/images/thermal-garden.webp"
              alt="Cubierta térmica azul ajustada a una alberca junto a un jardín"
              fill
              sizes="(max-width: 767px) 100vw, 45vw"
            />
          </div>
          <div>
            <p className="eyebrow">MÁS MOMENTOS EN TU ALBERCA</p>
            <h2>
              Disfruta más.
              <br />
              Pierde menos agua y calor.
            </h2>
            <p>
              Una cubierta térmica flota sobre el agua y ayuda a conservar su
              temperatura mientras la alberca no está en uso.
            </p>
            <ul className="benefit-list">
              <li>Ayuda a conservar la temperatura del agua.</li>
              <li>Reduce la evaporación al cubrir la superficie.</li>
              <li>
                Limita la entrada de hojas y residuos mientras está colocada.
              </li>
              <li>Se fabrica para las dimensiones de tu alberca.</li>
            </ul>
            <p className="safety-note">
              Una cubierta térmica no es una cubierta de seguridad. No está
              diseñada para sostener personas ni prevenir caídas.
            </p>
            <a href="#calculadora" className="text-link">
              Calcula la tuya <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
