const features = [
  {
    index: "01",
    title: "A tu medida.",
    body: "Le damos a tu alberca una cubierta unica. Sin recortes, sin bordes sobrantes, sin huecos por donde se escape el calor.",
  },
  {
    index: "02",
    title: "Retiene el calor.",
    body: "Miles de burbujas de aire selladas trabajan toda la noche para que el agua amanezca a la misma temperatura. Sin calefacción extra, sin gasto.",
  },
  {
    index: "03",
    title: "Menos agua perdida. Menos químicos tirados.",
    body: "Cada litro que se evapora se lleva cloro y tratamiento contigo. Una cubierta puede ahorrarte semanas de mantenimiento al mes.",
  },
  {
    index: "04",
    title: "Hecha para resistir el sol.",
    body: "Nuestro material LDPE con estabilizadores UV aguanta años de exposición directa sin perder forma ni función.",
  },
  {
    index: "05",
    title: "Si tu alberca tiene forma, le hacemos su cubierta.",
    body: "Rectangular, redonda, con escalones o completamente irregular.",
  },
];

export default function FeatureList() {
  return (
    <section id="por-que-covers" className="bg-offwhite py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-4">
          <span className="label-caps text-teal">Por qué Covers</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-navy tracking-tight mb-14 max-w-xl">
          No es un plástico azul. Es ingeniería térmica.
        </h2>

        <div className="divide-y divide-navy/10 border-t border-navy/10">
          {features.map((f) => (
            <div
              key={f.index}
              className="grid md:grid-cols-[72px_1fr_2fr] gap-2 md:gap-10 py-9"
            >
              <span className="text-3xl font-extrabold text-navy/[0.12] tabular-nums leading-none pt-1">
                {f.index}
              </span>
              <h3 className="text-lg font-extrabold text-navy tracking-tight leading-snug">
                {f.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: "#374151" }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
