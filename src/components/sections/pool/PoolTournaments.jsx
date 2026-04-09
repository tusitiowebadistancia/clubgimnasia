import Reveal from "../../common/Reveal";

export default function PoolTournaments() {
  return (
    <section className="bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="rounded-3xl border border-white/10 bg-[#111] p-8 md:p-12">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-500">
              Proyección a futuro
            </p>

            <h2 className="mb-6 text-3xl md:text-4xl">
              Torneos y encuentros especiales
            </h2>

            <p className="text-zinc-400">
              Esta sección está pensada para comunicar futuros torneos, desafíos
              entre jugadores y eventos especiales de pool, sumando más movimiento,
              recurrencia y comunidad alrededor del club.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}