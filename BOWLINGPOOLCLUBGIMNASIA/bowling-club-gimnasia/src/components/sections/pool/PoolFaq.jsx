import Reveal from "../../common/Reveal";

const faqs = [
  {
    q: "¿Hace falta reservar antes de ir?",
    a: "No, aunque recomendamos consultar previamente por WhatsApp para verificar disponibilidad y coordinar tu visita de forma más cómoda.",
  },
  {
    q: "¿Es solo para jugadores avanzados?",
    a: "No. El pool está pensado tanto para jugadores con experiencia como para quienes simplemente quieren disfrutar de un buen momento.",
  },
  {
    q: "¿Se puede combinar con otras actividades del club?",
    a: "Sí, podés complementar la experiencia con otras propuestas del club, creando una salida más completa y entretenida.",
  },
];

export default function PoolFaq() {
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