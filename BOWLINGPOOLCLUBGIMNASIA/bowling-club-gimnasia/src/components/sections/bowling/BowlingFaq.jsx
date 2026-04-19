import Reveal from "../../common/Reveal";

const faqs = [
  {
    q: "¿Se puede reservar con anticipación?",
    a: "Sí, podés consultar disponibilidad y coordinar tu visita con anticipación a través de WhatsApp para organizar mejor tu experiencia.",
  },
  {
    q: "¿Es una actividad solo para grupos?",
    a: "No. El bowling es una propuesta ideal tanto para grupos como para parejas, familias o salidas más reducidas.",
  },
  {
    q: "¿Se puede usar para festejos o eventos especiales?",
    a: "Sí, el espacio también es una excelente opción para cumpleaños, reuniones y distintos tipos de celebraciones.",
  },
];

export default function BowlingFaq() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl">Preguntas frecuentes</h2>
        </Reveal>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <Reveal key={faq.q}>
              <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
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