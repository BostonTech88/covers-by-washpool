const steps = [
  {
    number: "01",
    title: "Nos dices cómo es tu alberca",
    body: "Escríbenos por WhatsApp con las medidas de tu alberca.",
  },
  {
    number: "02",
    title: "Recibes tu propuesta en 24 horas",
    body: "Sin llamadas, sin visitas obligatorias. Te mandamos una cotización directo a tu correo.",
  },
  {
    number: "03",
    title: "Creamos tu cubierta",
    body: "Cortamos y terminamos tu cubierta con tus medidas.",
  },
  {
    number: "04",
    title: "Lista para usar",
    body: "Envío a todo México con instrucciones de instalación. Si tienes dudas, te apoyamos en remoto.",
  },
];

export default function Process() {
  return (
    <section id="el-proceso" className="bg-navy py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-4">
          <span className="label-caps text-teal">El proceso</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-16">
          De tu alberca a tu cubierta en 4 pasos.
        </h2>

        <div className="grid md:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`pt-8 md:pr-10 pb-8 md:pb-0 ${
                i > 0
                  ? "md:pl-10 md:border-l border-teal/25 mt-8 md:mt-0 border-t md:border-t-0 border-white/10"
                  : ""
              }`}
            >
              <span className="label-caps text-teal block mb-4">
                Paso {step.number}
              </span>
              <h3 className="text-white font-extrabold text-xl tracking-tight mb-3">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
