import Reveal from "../../common/Reveal";
import SectionTitle from "../../common/SectionTitle";

export default function ExperienceSection() {
  return (
    <section className="bg-black/35 px-4 py-20 text-white backdrop-blur-[2px]">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
        <Reveal>
          <SectionTitle
            eyebrow="La experiencia"
            title="Un lugar pensado para disfrutar, compartir y volver"
            description="En Bowling Club Gimnasia no venís solo a jugar: venís a vivir una salida completa, con ambiente, entretenimiento y momentos que valen la pena."
          />
        </Reveal>

        <Reveal>
          <div className="rounded-3xl border border-white/10 bg-zinc-900/65 p-8 backdrop-blur-sm">
            <p className="mb-4 text-zinc-300">
              Cada visita está pensada para que la pases bien desde que entrás hasta que te vas.
              Ya sea una salida con amigos, un plan en pareja, una reunión familiar o una noche distinta,
              el club combina diversión, comodidad y un entorno que invita a quedarse más tiempo.
            </p>
            <p className="text-zinc-400">
              Por eso esta experiencia no se resume en una pista o una mesa: se trata de encontrar un lugar
              donde jugar, relajarte, compartir y crear recuerdos que te den ganas de volver.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}