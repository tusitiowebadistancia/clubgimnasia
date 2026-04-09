import Reveal from "../../common/Reveal";

const promos = [
  {
    title: "Promo salida con amigos",
    text: "Una propuesta ideal para quienes quieren compartir una noche distinta.",
  },
  {
    title: "Promo after office",
    text: "Una opción pensada para cerrar el día con una actividad entretenida.",
  },
  {
    title: "Promo para grupos",
    text: "Perfecta para reuniones más amplias y momentos compartidos.",
  },
];

export default function PoolPromos() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-12 text-3xl md:text-4xl">Promociones de Pool</h2>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
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