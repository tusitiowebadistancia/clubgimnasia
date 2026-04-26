import Reveal from "../../common/Reveal";

export default function BowlingPromos() {
  return (
    <section className="bg-black/35 px-4 py-24 text-white backdrop-blur-[2px]">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <div className="bowling-brand-logo mb-6">
              <span className="bowling-brand-club">Club</span>{" "}
              <span className="bowling-brand-gimnasia neon-flicker">Gimnasia</span>
            </div>

            <p className="mx-auto max-w-2xl text-zinc-400 md:text-lg">
              Seguinos en Instagram para ver el ambiente del club, momentos reales, partidas,
              novedades y todo lo que hace que cada visita se convierta en una salida distinta.
              Si querés sentir la energía del lugar antes de venir, ahí empieza la experiencia.
            </p>

            <a
              href="https://instagram.com/bowlingimnasia"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 instagram-btn"
            >
              Seguinos en Instagram
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}