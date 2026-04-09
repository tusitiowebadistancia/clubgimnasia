import Reveal from "../../common/Reveal";

const items = [
  "Ambiente cómodo y relajado para disfrutar con amigos",
  "Espacio ideal para encuentros informales o salidas nocturnas",
  "Experiencia pensada para combinar entretenimiento y buena compañía",
  "Una propuesta distinta dentro de Bowling Club Gimnasia",
];

export default function PoolEnvironment() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-10 text-3xl md:text-4xl">Mesas y ambiente</h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <Reveal key={item}>
              <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6 text-zinc-300">
                {item}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}