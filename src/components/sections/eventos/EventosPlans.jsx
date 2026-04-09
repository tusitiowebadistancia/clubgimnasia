import Reveal from "../../common/Reveal";

const plans = [
  {
    title: "Plan base",
    text: "Ideal para quienes buscan una propuesta simple, clara y divertida.",
  },
  {
    title: "Plan grupal",
    text: "Pensado para reuniones más grandes con foco en compartir y disfrutar.",
  },
  {
    title: "Plan celebración",
    text: "Orientado a cumpleaños o eventos con una experiencia más especial.",
  },
];

export default function EventosPlans() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl">Planes y paquetes</h2>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Reveal key={plan.title}>
              <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8">
                <h3 className="mb-4 text-2xl">{plan.title}</h3>
                <p className="text-zinc-400">{plan.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}