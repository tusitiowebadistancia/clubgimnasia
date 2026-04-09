import Reveal from "../../common/Reveal";

const steps = [
  {
    title: "Elegí tu momento",
    text: "Podés venir con amigos, en pareja, con familia o para festejar algo especial.",
  },
  {
    title: "Consultá disponibilidad",
    text: "Te escriben por WhatsApp y coordinás el mejor horario de forma simple.",
  },
  {
    title: "Disfrutá la experiencia",
    text: "Llegás al club, jugás y vivís una salida distinta en Necochea.",
  },
];

export default function BowlingHowItWorks() {
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