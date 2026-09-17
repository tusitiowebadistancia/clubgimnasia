import Reveal from "../../common/Reveal";

export default function PoolHero() {
  return (
    <section className="relative overflow-hidden bg-black px-4 py-24 text-white md:py-32">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl text-center">
        <Reveal>
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-400">
            Pool en Necochea
          </p>

          <h1 className="mb-6 text-4xl md:text-6xl">
            Precisión, ambiente y buena compañía
          </h1>

          <p className="mx-auto max-w-3xl text-lg text-zinc-300 md:text-xl">
            Disfrutá del pool en Bowling Club Gimnasia, en un entorno ideal para
            relajarte, competir y compartir una salida distinta.
          </p>
        </Reveal>
      </div>
    </section>
  );
}