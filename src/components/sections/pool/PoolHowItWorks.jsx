import Reveal from "../../common/Reveal";

const steps = [
  {
    title: "Elegí tu plan",
    text: "Podés venir a jugar de forma relajada, con amigos o como parte de una salida más completa.",
  },
  {
    title: "Consultá disponibilidad",
    text: "El contacto se hace de forma simple por WhatsApp para coordinar mejor el momento.",
  },
  {
    title: "Disfrutá la experiencia",
    text: "Llegás al club y vivís una propuesta distinta, social y entretenida en Necochea.",
  },
];

export default function PoolHowItWorks() {
  return (
    <section className="bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl">¿Cómo funciona?</h2>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title}>
              <div className="rounded-2xl border border-white/10 bg-[#111] p-8">
                <span className="mb-4 inline-block text-sm uppercase tracking-[0.3em] text-zinc-500">
                  Paso {index + 1}
                </span>
                <h3 className="mb-4 text-2xl">{step.title}</h3>
                <p className="text-zinc-400">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}