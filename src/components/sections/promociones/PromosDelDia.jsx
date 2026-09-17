import Reveal from "../../common/Reveal";

const promos = [
  {
    title: "Promo del día",
    text: "Una propuesta destacada pensada para incentivar visitas en jornadas específicas.",
  },
  {
    title: "Promo express",
    text: "Ideal para quienes quieren decidir rápido y aprovechar una opción concreta.",
  },
];

export default function PromosDelDia() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl">Promociones del día</h2>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2">
          {promos.map((promo) => (
            <Reveal key={promo.title}>
              <div className="rounded-2xl bg-zinc-900 p-8 transition hover:-translate-y-1 hover:bg-zinc-800">
                <h3 className="mb-4 text-2xl">{promo.title}</h3>
                <p className="text-zinc-400">{promo.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}