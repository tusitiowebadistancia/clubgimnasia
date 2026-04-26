import Reveal from "../../common/Reveal";

const faqs = [
  {
    q: "¿Se puede consultar por cumpleaños o celebraciones?",
    a: "Sí, podés comunicarte para consultar opciones disponibles para cumpleaños, reuniones y distintas celebraciones dentro del club.",
  },
  {
    q: "¿Es solo para grupos grandes?",
    a: "No. Las propuestas pueden adaptarse tanto a grupos numerosos como a encuentros más reducidos, según lo que necesites.",
  },
  {
    q: "¿Cómo se coordina el evento?",
    a: "La coordinación inicial se realiza por WhatsApp, donde se puede consultar disponibilidad, detalles y necesidades específicas para el evento.",
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