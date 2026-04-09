import Reveal from "../../common/Reveal";

const items = [
  "Espacio pensado para disfrutar con amigos o familia",
  "Ambiente cómodo, social y entretenido",
  "Ideal para salidas, festejos y reuniones",
  "Posibilidad de combinar la experiencia con otras áreas del club",
];

export default function BowlingIncludes() {
  return (
    <section className="bg-[#111] px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="mb-10 text-3xl md:text-4xl">¿Qué incluye la experiencia?</h2>
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