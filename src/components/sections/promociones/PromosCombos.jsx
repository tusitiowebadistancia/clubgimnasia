import Reveal from "../../common/Reveal";

const combos = [
  {
    title: "Combo bowling + salida",
    text: "Una propuesta pensada para quienes buscan una experiencia más completa dentro del club.",
  },
  {
    title: "Combo celebración",
    text: "Ideal para cumpleaños, encuentros especiales y momentos que merecen algo distinto.",
  },
  {
    title: "Combo grupal",
    text: "Una alternativa orientada a grupos que quieren aprovechar mejor la visita.",
  },
];

export default function PromosCombos() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl">Combos</h2>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {combos.map((combo) => (
            <Reveal key={combo.title}>
              <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8">
                <h3 className="mb-4 text-2xl">{combo.title}</h3>
                <p className="text-zinc-400">{combo.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}