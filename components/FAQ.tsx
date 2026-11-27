import { questions } from "@/lib/faq";
export default function FAQ() {
  return (
    <section id="preguntas" className="section faq">
      <div className="wrap faq-layout">
        <div>
          <p className="eyebrow">ANTES DE DAR EL SIGUIENTE PASO</p>
          <h2>
            Buenas preguntas.
            <br />
            Respuestas claras.
          </h2>
          <p>Lo esencial para elegir tu cubierta térmica con confianza.</p>
        </div>
        <div className="faq-list">
          {questions.map(([question, answer]) => (
            <details key={question}>
              <summary>
                <h3>{question}</h3>
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
