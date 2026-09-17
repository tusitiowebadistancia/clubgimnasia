import Reveal from "../../common/Reveal";

const promos = [
  "Propuestas ideales para días de menor movimiento",
  "Opciones pensadas para instalar hábitos de visita",
  "Promociones orientadas a salidas casuales entre semana",
];

export default function PromosSemanales() {
  return (
    <section className="bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-10 text-3xl md:text-4xl">Promociones semanales</h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {promos.map((promo) => (
            <Reveal key={promo}>
              <div className="rounded-2xl border border-white/10 bg-[#111] p-6 text-zinc-300">
                {promo}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}