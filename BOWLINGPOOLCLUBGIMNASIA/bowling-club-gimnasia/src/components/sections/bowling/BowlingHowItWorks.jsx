import Reveal from "../../common/Reveal";

const steps = [
  {
    title: "Elegí el plan perfecto para vos",
    text: "Podés venir con amigos, en pareja, en familia o aprovechar una fecha especial para convertirla en una salida mucho más divertida.",
  },
  {
    title: "Consultá y reservá sin complicarte",
    text: "Desde WhatsApp resolvés disponibilidad, horarios y tu visita de forma rápida, directa y sin vueltas.",
  },
  {
    title: "Vení y disfrutá una salida distinta",
    text: "Solo queda llegar al club, jugar y vivir una experiencia que combina entretenimiento, ambiente y buenos momentos en Necochea.",
  },
];

export default function BowlingHowItWorks() {
  return (
    <section className="bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl">
            Reservar y venir es mucho más simple de lo que imaginás
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