import Reveal from "../../common/Reveal";

const steps = [
  {
    title: "Elegí cómo querés vivir la salida",
    text: "Podés venir a jugar tranquilo, compartir unas partidas con amigos o sumar el pool a una noche más completa dentro del club.",
  },
  {
    title: "Consultá y organizá todo en minutos",
    text: "Desde WhatsApp resolvés disponibilidad, horarios y tu visita de forma rápida, directa y sin complicaciones.",
  },
  {
    title: "Llegá y disfrutá una experiencia distinta",
    text: "Solo queda venir, jugar y dejar que el ambiente haga el resto: pool, buena energía y una salida diferente en Necochea.",
  },
];

export default function PoolHowItWorks() {
  return (
    <section className="bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl">
            Venir a jugar es mucho más simple de lo que imaginás
          </h2>
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