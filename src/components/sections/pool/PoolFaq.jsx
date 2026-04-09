import Reveal from "../../common/Reveal";

const faqs = [
  {
    q: "¿Hace falta reservar antes de ir?",
    a: "Lo ideal es consultar antes por WhatsApp para coordinar mejor y asegurarte disponibilidad.",
  },
  {
    q: "¿Es solo para jugadores avanzados?",
    a: "No, la propuesta está pensada tanto para quienes ya juegan como para quienes quieren pasar un buen rato.",
  },
  {
    q: "¿Se puede combinar con otras actividades del club?",
    a: "Sí, la experiencia del club permite proyectar una salida más completa y variada.",
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