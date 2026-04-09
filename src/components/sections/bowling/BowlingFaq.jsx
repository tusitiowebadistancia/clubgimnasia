import Reveal from "../../common/Reveal";

const faqs = [
  {
    q: "¿Se puede reservar con anticipación?",
    a: "Sí, la idea es que la persona pueda consultar y coordinar su visita por WhatsApp.",
  },
  {
    q: "¿Es una actividad solo para grupos?",
    a: "No, también es ideal para parejas, familias o salidas más pequeñas.",
  },
  {
    q: "¿Se puede usar para festejos?",
    a: "Sí, el bowling también está pensado como parte de cumpleaños y eventos especiales.",
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