import Reveal from "../../common/Reveal";

const plans = [
  {
    title: "Plan base",
    text: "Ideal para quienes quieren resolver una salida de forma simple, clara y divertida, sin perder la esencia de una gran experiencia.",
  },
  {
    title: "Plan grupal",
    text: "Pensado para reuniones más grandes donde compartir, reírse y disfrutar juntos sea parte central del momento.",
  },
  {
    title: "Plan celebración",
    text: "La opción perfecta para cumpleaños y eventos especiales que buscan sentirse más completos, memorables y diferentes.",
  },
];

export default function EventosPlans() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl">
            Opciones pensadas para que cada evento se adapte mejor a vos
          </h2>
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