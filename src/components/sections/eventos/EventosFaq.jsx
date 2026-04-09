import Reveal from "../../common/Reveal";

const faqs = [
  {
    q: "¿Se puede consultar por cumpleaños?",
    a: "Sí, la página está pensada justamente para facilitar consultas de cumpleaños y celebraciones.",
  },
  {
    q: "¿Es solo para grupos grandes?",
    a: "No, también puede adaptarse a encuentros más chicos según la propuesta del club.",
  },
  {
    q: "¿Cómo se coordina el evento?",
    a: "El contacto inicial se hace por WhatsApp para definir disponibilidad y necesidades.",
  },
];

export default function EventosFaq() {
  return (
    <section className="bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl">Preguntas frecuentes</h2>
        </Reveal>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <Reveal key={faq.q}>
              <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
                <h3 className="mb-3 text-xl">{faq.q}</h3>
                <p className="text-zinc-400">{faq.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}